module.exports = function(router, swaggerUi){

  router.use('/api-docs', function (req, res) {
    res.json(require('../Swagger/swagger'));
  });

  router.use('/docs', swaggerUi({
    docs: '/api-docs' // from the express route above.
  }));

  return router;
}
