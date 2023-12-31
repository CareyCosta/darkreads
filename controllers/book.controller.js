const db = require('../db');
const Book = db.book;
const Category = db.category;
const Op = db.Sequelize.Op;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request

  if (!req.body.googleId) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Book
  const { googleId, ISBN10, ISBN13, categories } = req.body;

  // Save Book in the database
  Book.create(
    { googleId, ISBN10, ISBN13, categories },
    {
      include: [{ association: Book.categories }],
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.',
      });
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Book.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Book with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Book with id=' + id,
      });
    });
};

// Find a single Book with an id
exports.findByGoogleId = async (req, res) => {
  const googleId = req.params.googleId;

  try {
    const book = await Book.findOne({
      where: { googleId: googleId },
      include: Book.categories,
    });
    if (book) {
      res.send(book);
    } else {
      res.status(404).send({
        message: `Cannot find Book with googleId=${googleId}.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err || 'Error retrieving Book with googleId=' + googleId,
    });
  }
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Butorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Book was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Book with id=' + id,
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Butorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Book was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Book with id=' + id,
      });
    });
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  Book.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Books were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all tutorials.',
      });
    });
};

// Find all published Books
exports.findAllPublished = (req, res) => {
  Book.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

// exports.addCategories = async (req, res) => {
//   const { categories, bookId } = req.body;

//   console.log('categories', categories);
//   console.log('bookId', bookId);
//   // return Book.findByPk(bookId)
//   //   .then((book) => {
//   //     if (!book) {
//   //       console.log('Book not found!');
//   //       return null;
//   //     }
//   //     return Category.findByPk(categoryId).then((category) => {
//   //       if (!category) {
//   //         console.log('Category not found!');
//   //         return null;
//   //       }

//   //       book.addCategory(category);
//   //       console.log(
//   //         `>> added Category id=${category.id} to Book id=${book.id}`
//   //       );
//   //       return category;
//   //     });
//   //   })
//   //   .catch((err) => {
//   //     console.log('>> Error while adding Category to Book: ', err);
//   //   });
//   try {
//     const book = Book.findByPk(bookId);
//     categories.forEach((cat) => {
//       book.addCategories(cat);
//     });
//     res.send({ book });
//   } catch (e) {
//     console.error(e);
//   }
// };
