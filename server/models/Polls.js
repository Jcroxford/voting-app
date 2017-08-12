module.exports = (sequelize, DataTypes) => {
  const Polls = sequelize.define('Polls', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    classMethods: {
      associate: (models) => {
        // Polls.belongsTo(models.Users)
        Polls.hasMany(models.PollOptions)
      }
    }
  })

  return Polls
}
