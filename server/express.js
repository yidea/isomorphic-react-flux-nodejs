/**
 * Express
 */
var HOST = process.env.HOST || "127.0.0.1";
var PORT = process.env.PORT || 3000;
var WEBPACK_DEV = process.env.WEBPACK_DEV === "true";
var WEBPACK_DEV_PORT = "2992";

var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");
var flash = require("express-flash");
var morgan = require("morgan");
var methodOverride = require("method-override");
var compression = require("compression");
var exphbs = require("express-handlebars");

var secrets = require("../config/secrets");
var app = module.exports = express();

// Express setup
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("views", path.join(__dirname, "./views"));
app.use("/js", express.static(path.join(__dirname, "../dist/js")));
app.use(express.static(path.join(__dirname, "../..", "public")));
app.use(express.static(__dirname + "/dist", { maxage: "720h" })); // set Etag, maxage
// X-Powered-By header has no functional value.
// Keeping it makes it easier for an attacker to build the site"s profile
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride());
if (WEBPACK_DEV) {
  app.use(morgan("dev")); // log request to console on DEV
}

// Cookie parser should be above session
// cookieParser - Parse Cookie header and populate req.cookies with an object keyed by cookie names
// Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret
// so it may be used by other middleware
app.use(cookieParser());
// Create a session middleware with the given options
app.use(session({
  resave: true,
  saveUninitialized: true,
  // Use generic cookie name for security purposes
  key: "sessionId",
  secret: secrets.sessionSecret,
  // Add HTTPOnly, Secure attributes on Session Cookie
  cookie: {
    httpOnly: true,
    secure: true
  }
}));
app.use(flash());
app.use(compression()); // gzip response

/**
 * Routes
 */
// Application
app.get("/", function (req, res) {
  // Render JS? Server-side? Bootstrap?
  // JS/CSS bundle rendering.
  var bundleJs;
  var bundleCss;
  var renderJs = true;

  if (WEBPACK_DEV) {
    bundleJs = "http://" + HOST + ":" + WEBPACK_DEV_PORT + "/js/bundle.js";
    //bundleJs = `http://127.0.0.1:${WEBPACK_DEV_PORT}/js/bundle.js`;
    //bundleCss = `http://127.0.0.1:${WEBPACK_DEV_PORT}/js/style.css`;
  } else { // PROD
    var stats = require("../dist/server/stats.json");
    bundleJs = path.join("/js", stats.assetsByChunkName.main[0]);
    bundleCss = path.join("/js", stats.assetsByChunkName.main[1]);
  }

  // Server-rendered page.
  var content;
  //if (renderSs) {
  //  content = res.locals.bootstrapComponent ||
  //    React.renderToString(new Page({ flux: new Flux() }));
  //}

  // Response.
  res.render("index.hbs", {
    layout: false,
    title: WEBPACK_DEV ? "Dev" : "Prod",
    bootstrap: res.locals.bootstrapData,
    render: {
      js: renderJs
    },
    bundles: {
      js: bundleJs,
      css: bundleCss
    },
    content: content
  });
});

// REST API
app.use("/api", require("./routes/routesApi"));

// 404 custom error handler
//app.use(function (req, res) { //handle all unhandled requests, put at bottom
//  res.status(404).render("404", {content: "404 Sorry, page not found"});
//});

//start server
app.listen(PORT);
