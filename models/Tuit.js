const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const User = require('./User')

const Tuit = db.define('Tuit', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
})

Tuit.belongsTo(User)
User.hasMany(Tuit)

module.exports = Tuit