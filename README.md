Item Setup
=================

Quick experiment for Item setup auto shelf with FE stack on Node.js & React

### FE Stack

- Client: React + Alt + Stylus + React Router 
- Server: Express + Handlebars 
- Build: Webpack + Babel
- Data: Firebase
- Lint: Eslint

### Development

```
$ npm install
$ npm run hot or npm run dev
```

Testing http://localhost:3000

### Production

```
$ npm install --production
$ npm run build
$ npm install pm2 -g
$ NODE_ENV=production pm2 start server/index.js
```

### TODO

- Flux: Firebase to store, bluebird promise, mixin?
- UI: multiply tendency, mobile, app, tween state react, spinner
 zebra table styling, confidence level component 
- Server: add API cache, cors
- Tests infrastructure
- Isomophic infrastructure
- Firebase daily backup
