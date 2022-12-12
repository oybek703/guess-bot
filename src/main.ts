import 'colors'
import { config } from 'dotenv'
import { Telegraf } from 'telegraf'

config()

const token = process.env.API_TOKEN
const bot = new Telegraf(token || '')

bot.start(function (ctx) {
  const { first_name, last_name } = ctx.update.message.from
  return ctx.reply(`Hi ${first_name || ''} ${last_name || ''} 🖐. Welcome to shop bot🙂`)
})

bot.help(function (ctx) {
  const { first_name, last_name } = ctx.update.message.from
  return ctx.reply(`Your name is ${first_name || ''} ${last_name || ''}🙂`)
})

bot.on('text', function (ctx) {
  const { text } = ctx.update.message
  return ctx.reply(`You sent me "${text}"`)
})

async function start() {
  try {
    bot.telegram.setMyCommands([
      { command: 'start', description: 'Start shop bot.' },
      { command: 'help', description: 'Get your info from bot.' }
    ])
    bot.launch()
    console.log('Bot launched successfully!'.blue.underline)
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error('Error while launching bot!'.red)
    }
  }
}

;(async () => await start())()

process.on('SIGINT', () => bot.stop('SIGINT'))
process.on('SIGTERM', () => bot.stop('SIGTERM'))
