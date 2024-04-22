const MSSQL = require('../lib/mssql');

class ANSWER_PACK extends MSSQL {
  constructor() {
    super();

    this.table = this._sequelize.define(
        'ANSWER_PACK',
        {
          ANS_ID: {
            type: this.DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
          },
          MESSAGES: {
            type: this.DataTypes.STRING('MAX'),
            allowNull: true,
          },
          // ACTIVE: {
          //   type: this.DataTypes.STRING(1),
          //   allowNull: true,
          //   defaultValue: 'Y'
          // },
          MEMO: {
            type: this.DataTypes.STRING(1000),
            allowNull: true,
          },
          CREATE_TIME: {
            type: this.DataTypes.DATE,
            allowNull: false,
            defaultValue: this.Sequelize.fn('GETDATE'),
          },
          UPDATE_TIME: {
            type: this.DataTypes.DATE,
            allowNull: false,
            defaultValue: this.Sequelize.fn('GETDATE'),
          }
        },
        {
          freezeTableName: true,
          timestamps: true,
          createdAt: 'CREATE_TIME',
          updatedAt: 'UPDATE_TIME',
        }
    );

    this.table.sync();

  }

  insertAnswerPack({ ANS_ID, MESSAGES, MEMO }) {
    const data = {
      ANS_ID,
      MESSAGES,
      MEMO: MEMO || '',
    };
    return this.table.create(data);
  }

  getAnswerPack(ansId) {
    return this.table.findOne({
      where: {
        ANS_ID: ansId
      },
      attributes: ["ANS_ID", "MESSAGES"],
      raw: true
    })
  }
}

module.exports = new ANSWER_PACK();