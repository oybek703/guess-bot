import { Sequelize } from 'sequelize'
import getConfig from './config'

getConfig()

const sequelize = new Sequelize({
  dialect: 'postgres',
  port: Number(process.env.PGPORT),
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD
})

export default sequelize
