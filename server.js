const express = require('express');
const cors = require('cors');
const path = require('path');

var corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();
const port = process.env.PORT || 5000;


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./db.js');

// In development, you may need to drop existing tables and re-sync database. Just use force: true as following code:
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

require("./routes/book.routes.js")(app);
require("./routes/category.routes.js")(app);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));
