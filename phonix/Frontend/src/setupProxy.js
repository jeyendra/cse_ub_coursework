const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://xlabk8s2.cse.buffalo.edu:30008',
      changeOrigin: true,
    })
  );
};
