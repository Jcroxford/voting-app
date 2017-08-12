// const DataTypes = require('sequelize/lib/data-types')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Polls', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}
