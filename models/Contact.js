const { DataTypes } = require("sequelize");
const db = require("../config/db");
const User = require("./User");

const Contact = db.sequelize.define( "Contact", {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },    
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spam: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);
Contact.belongsTo(User, { foreignKey: 'user_id' });

Contact.sync()
  .then(() => {
    console.log("contact Table!");
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = Contact;
