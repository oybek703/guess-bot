import sequelize from '../database'
import { DataTypes } from 'sequelize'

export const UserModel = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
  chatId: { type: DataTypes.STRING, unique: true },
  rightAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrongAnswers: { type: DataTypes.INTEGER, defaultValue: 0 }
})
