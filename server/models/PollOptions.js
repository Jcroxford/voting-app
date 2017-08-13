module.exports = (sequelize, DataTypes) => {
  const PollOptions = sequelize.define('PollOptions', {
    pollText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  })

  return PollOptions
}
