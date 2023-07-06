module.exports = (app) => {
  const categories = require('../controllers/category.controller');

  var router = require('express').Router();

  // Create a new Category
  router.post('/', categories.create);

  // Retrieve all Categories
  router.get('/', categories.findAll);

  // Create bulk Categories
  router.post('/bulk/', categories.bulkCreate);

  app.use('/api/category', router);
};
