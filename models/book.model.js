module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define('book', {
    googleId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    subjects: {
      type: Sequelize.JSON,
    },
    ISBN10: {
      type: Sequelize.STRING,
      unique: true,
    },
    ISBN13: {
      type: Sequelize.STRING,
      unique: true,
    },
    collectionName: {
      type: Sequelize.STRING,
    },
  });

  return Book;
};

/**
 * This Sequelize Model represents tutorials table in MySQL database. These columns will be generated automatically: id, title, description, published, createdAt, updatedAt.

After initializing Sequelize, we don’t need to write CRUD functions, Sequelize supports all of them:

create a new Tutorial: create(object)
find a Tutorial by id: findByPk(id)
get all Tutorials: findAll()
update a Tutorial by id: update(data, where: { id: id })
remove a Tutorial: destroy(where: { id: id })
remove all Tutorials: destroy(where: {})
find all Tutorials by title: findAll({ where: { title: ... } })
These functions will be used in our Controller.
 */
