import 'colors'
import { Telegraf } from 'telegraf'
import './models/user.model'
import { helpCommand, onGameCallbackQuery, onText, setBotCommands, startCommand } from './commands'
import sequelize from './database'
import getConfig from './config'

getConfig()

const bot = new Telegraf(`${process.env.BOT_TOKEN}`)

// Start command
bot.start(startCommand)

// Help command
bot.help(helpCommand)

// Handle text
bot.on('text', onText)

// Game callback query
bot.on('callback_query', onGameCallbackQuery)

async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log(`Successfully connected to database`.yellow.underline)
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
      console.log(`Error while connecting to database: ${e.message}`.red)
    }
  }
  try {
    await setBotCommands(bot)
    await bot.launch()
    console.log('Bot launched successfully!'.blue.underline)
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error while launching bot: ${e.message}`.red)
    }
  }
}

;(async () => await start())()

process.on('SIGINT', () => bot.stop('SIGINT'))
process.on('SIGTERM', () => bot.stop('SIGTERM'))
