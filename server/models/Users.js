const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCreate (user, options, cb) {
          const password = user.password

          return new Promise((resolve, reject) => {
            bcrypt.genSalt(10)
              .then(salt => bcrypt.hash(password, salt))
              .then(hashedPassword => resolve(user.password = hashedPassword))
              .catch(error => reject(error))
          })
        }
      }
    }
  )

  return Users
}
