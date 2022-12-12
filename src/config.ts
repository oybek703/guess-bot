import { dirname, join } from 'path'
import { config } from 'dotenv'

export default function getConfig() {
  const developmentEnvPath = join(dirname(__dirname), '.development.env')
  const productionEnvPath = join(dirname(__dirname), '.env')

  config({
    path: process.env.NODE_ENV === 'development' ? developmentEnvPath : productionEnvPath
  })
}
