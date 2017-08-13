module.exports = (sequelize, DataTypes) => {
  const Polls = sequelize.define('Polls', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return Polls
}
