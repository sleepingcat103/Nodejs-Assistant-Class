const { Sequelize, DataTypes } = require('sequelize');

const MSSQL_DATABASE = 'demo';
const MSSQL_ACCOUNT = 'SA';
const MSSQL_PASSWORD = 'nks^=Dr^38w^i38';
const MSSQL_HOST = '127.0.0.1';
const MSSQL_PORT = 1433;

const sequelize = new Sequelize(MSSQL_DATABASE, MSSQL_ACCOUNT, MSSQL_PASSWORD, {
  host: MSSQL_HOST,
  port: MSSQL_PORT,
  dialect: 'mssql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false,
  dialectOptions: {
    encrypt: true,
  },
});

// Model - each table one model
// 對話時紀錄log
class CONVERSATION_LOG {
  constructor() {
    this.#init();
  }

  #init() {
    this.table = sequelize.define(
        'CONVERSATION_LOG',
        {
          ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          USER_ID: {
            type: DataTypes.STRING(50),
            allowNull: true,
          },
          METHOD: {
            type: DataTypes.STRING(20),
            allowNull: true,
          },
          REQUEST_DATA: {
            type: DataTypes.STRING(1000),
            allowNull: true,
          },
          RESPONSE_DATA: {
            type: DataTypes.STRING('MAX'),
            allowNull: true,
          },
          INTENT: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
          CONFIDENCE: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
          ENTITY: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
          ERROR: {
            type: DataTypes.STRING('MAX'),
            allowNull: true,
          },
          CREATE_TIME: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('GETDATE'),
          }
        },
        {
          freezeTableName: true,
          timestamps: true,
          createdAt: 'CREATE_TIME',
          updatedAt: false,
        }
    );

    this.table.sync();
  }

  insertLog(data) {
    return this.table.create(data);
  }

  findUserConversation(userId) {
    return this.table.findAll({
      where: {
        USER_ID: userId
      },
      raw: true
    })
  }
}


// const CONVERSATION_LOG = sequelize.define(
//   'CONVERSATION_LOG',
//   {
//     ID: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     USER_ID: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     METHOD: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },
//     REQUEST_DATA: {
//       type: DataTypes.STRING(1000),
//       allowNull: true,
//     },
//     RESPONSE_DATA: {
//       type: DataTypes.STRING('MAX'),
//       allowNull: true,
//     },
//     INTENT: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     CONFIDENCE: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     ENTITY: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     ERROR: {
//       type: DataTypes.STRING('MAX'),
//       allowNull: true,
//     },
//     CREATE_TIME: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: Sequelize.fn('GETDATE'),
//     }
//   },
//   {
//     freezeTableName: true,
//     timestamps: true,
//     createdAt: 'CREATE_TIME',
//     updatedAt: false,
//   }
// );

// // !!!!!!!!!!!!!! { alter: true } => danger
// // !!!!!!!!!!!!!! { force: true } => danger

// async function main() {
//   await CONVERSATION_LOG.sync();

//   // await CONVERSATION_LOG.create({
//   //   USER_ID: 'user01',
//   //   METHOD: 'web',
//   //   REQUEST_DATA: '{"text": "Hello"}',
//   //   RESPONSE_DATA: '{"text": "Hi"}',
//   //   INTENT: '#打招呼',
//   //   CONFIDENCE: '1.0',
//   //   ENTITY: '',
//   //   ERROR: ''
//   // })
//   // await CONVERSATION_LOG.create({
//   //   USER_ID: 'user02',
//   //   METHOD: 'web',
//   //   REQUEST_DATA: '{"text": "Hello"}',
//   //   RESPONSE_DATA: '{"text": "Hi"}',
//   //   INTENT: '#打招呼',
//   //   CONFIDENCE: '1.0',
//   //   ENTITY: '',
//   //   ERROR: ''
//   // })
//   // await CONVERSATION_LOG.create({
//   //   USER_ID: 'user03',
//   //   METHOD: 'web',
//   //   REQUEST_DATA: '{"text": "Hello"}',
//   //   RESPONSE_DATA: '{"text": "Hi"}',
//   //   INTENT: '#打招呼',
//   //   CONFIDENCE: '1.0',
//   //   ENTITY: '',
//   //   ERROR: ''
//   // })

//   const result = await CONVERSATION_LOG.findAll({
//     where: {
//       USER_ID: 'user01'
//     },
//     raw: true
//   })

//   console.log(result)
// }

// main();

