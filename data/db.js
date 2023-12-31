const mysql = require("mysql2");
const config = require("../config");

/*let connection = mysql.createConnection(config.db);

connection.connect((err) => {
  if (err) {
    return console.log(err);
  }
});

module.exports = connection.promise() */

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
  }
);
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("mysql server bağlantısı başarılı");
  } catch (error) {
    console.log(error);
  }
}

connect()
module.exports = sequelize;
