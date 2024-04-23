const dayjs = require('dayjs');
const MSSQL = require('../lib/mssql');

class CONVERSATION_LOG extends MSSQL {
  constructor() {
    super();

    this.table = this._sequelize.define(
        'CONVERSATION_LOG',
        {
          ID: {
            type: this.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          USER_ID: {
            type: this.DataTypes.STRING(50),
            allowNull: true,
          },
          METHOD: {
            type: this.DataTypes.STRING(20),
            allowNull: true,
          },
          REQUEST_DATA: {
            type: this.DataTypes.STRING(1000),
            allowNull: true,
          },
          RESPONSE_DATA: {
            type: this.DataTypes.STRING('MAX'),
            allowNull: true,
          },
          INTENT: {
            type: this.DataTypes.STRING(255),
            allowNull: true,
          },
          CONFIDENCE: {
            type: this.DataTypes.STRING(255),
            allowNull: true,
          },
          ENTITY: {
            type: this.DataTypes.STRING(255),
            allowNull: true,
          },
          ERROR: {
            type: this.DataTypes.STRING('MAX'),
            allowNull: true,
          },
          CREATE_TIME: {
            type: this.DataTypes.DATE,
            allowNull: false,
            defaultValue: this.Sequelize.fn('GETDATE'),
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

  insertLog({ USER_ID, METHOD, REQUEST_DATA, RESPONSE_DATA, INTENT, CONFIDENCE, ENTITY, ERROR }) {
    const data = {
      USER_ID: USER_ID || '',
      METHOD: METHOD || '',
      REQUEST_DATA: REQUEST_DATA || '',
      RESPONSE_DATA: RESPONSE_DATA || '',
      INTENT: INTENT || '',
      CONFIDENCE: CONFIDENCE || '',
      ENTITY: ENTITY || '',
      ERROR: ERROR || ''
    };
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

  // startTime = '2024/04/15'
  // endTime = '2024/04/21'
  findConversationLog(startTime, endTime, offset = 0, limit = 500) {
    return this.table.findAll({
      where: {
        // "USER_ID":
        // "INTENT":
        // "CONFIDENCE":
        "CREATE_TIME": {
          [this.Op.gte]: new Date(startTime),
          [this.Op.lt]: new Date(dayjs(endTime).add(1, 'day'))
        }
      },
      limit: limit,
      offset: offset,
      raw: true
    })
  }
}

module.exports = new CONVERSATION_LOG();