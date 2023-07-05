const dbConfig = require('./db.config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.book = require('./book.model.js')(sequelize, Sequelize);
db.category = require('./category.model.js')(sequelize, Sequelize);

db.book.belongsToMany(db.category, { through: 'book_category', as: "categories" });

db.category.belongsToMany(db.book, { through: 'book_category', as: "books" });

module.exports = db;
