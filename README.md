Item Setup
=================

Quick experiment for Item setup auto shelf with FE stack on Node.js & React

### FE Stack
- Client: React + Alt + Stylus + React Router
- Server: Express + Handlebars 
- Build: Webpack + Babel
- Data: Firebase

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

- Tests
- Isomophic
- Firebase daily backup
