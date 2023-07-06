// const db = require('./category.model.js');
const { where } = require('sequelize');
const db = require('./db');
const Book = db.book;
const Category = db.category;

exports.create = (req, res) => {
  console.log(req.body);
  const { name } = req.body;

  Category.create({
    name,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.',
      });
    });
};

exports.bulkCreate = (req, res) => {
  Category.bulkCreate(req.body.categories, { validate: true, fields: ['name'] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.',
      });
    });
};

exports.addBook = (categoryId, bookId) => {
  return Category.findByPk(categoryId)
    .then((category) => {
      if (!category) {
        console.log('Category not found!');
        return null;
      }
      return Book.findByPk(bookId).then((book) => {
        if (!book) {
          console.log('Book not found!');
          return null;
        }

        category.addBook(book);
        console.log(
          `>> added Book id=${book.id} to Category id=${category.id}`
        );
        return category;
      });
    })
    .catch((err) => {
      console.log('>> Error while adding Book to Category: ', err);
    });
};

exports.findAll = (req, res) => {
  return Category.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while fetching Categories',
      });
    });
};

exports.findById = (id) => {
  return Category.findByPk(id, {
    include: [
      {
        model: Book,
        as: 'books',
        attributes: ['categories'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((category) => {
      return category;
    })
    .catch((err) => {
      console.log('>> Error while finding Category: ', err);
    });
};

exports.findByGoogleId = (bookId) => {
  return Category.findAll({ where: { bookId: bookId } })
    .then((category) => {
      return category;
    })
    .catch((err) => {
      console.log('>> Error while finding Category: ', err);
    });
};
