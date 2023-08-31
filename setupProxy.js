const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // L'URL de la route que vous souhaitez rediriger
    createProxyMiddleware({
      target: 'http://localhost:3000', // L'URL du serveur API distant
      changeOrigin: true,
    })
  );
};