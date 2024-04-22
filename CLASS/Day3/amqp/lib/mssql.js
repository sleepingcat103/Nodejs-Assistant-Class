const { Sequelize, DataTypes } = require('sequelize');
const {
  MSSQL_DATABASE,
  MSSQL_ACCOUNT,
  MSSQL_PASSWORD,
  MSSQL_HOST,
  MSSQL_PORT
} = process.env;

const sequelize = new Sequelize(MSSQL_DATABASE, MSSQL_ACCOUNT, MSSQL_PASSWORD, {
  host: MSSQL_HOST,
  port: MSSQL_PORT,
  dialect: 'mssql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  // logging: false,
  dialectOptions: {
    encrypt: true,
  },
});

class MSSQL {
  constructor() {
    this._sequelize = sequelize;
    this.Sequelize = Sequelize;
    this.DataTypes = DataTypes;
  }
}

module.exports = MSSQL;
// module.exports = new MSSQL();

