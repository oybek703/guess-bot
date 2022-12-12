import { againOptions, gameOptions } from './options'
import { Telegraf } from 'telegraf'
import { UserModel } from './models/user.model'

const chats: { [key: number]: number } = {}

export async function startCommand(ctx: any) {
  const { first_name, last_name } = ctx.update.message.from
  const chatId = ctx.update.message.chat.id
  const existingChat = await UserModel.findOne({ where: { chatId: chatId.toString() } })
  if (!existingChat) {
    await UserModel.create({ chatId })
  }
  return ctx.reply(`Hi ${first_name || ''} ${last_name || ''} 🖐. Welcome to shop bot🙂`)
}

export async function helpCommand(ctx: any) {
  const { first_name, last_name } = ctx.update.message.from
  const chatId = ctx.update.message.chat.id
  const user = await UserModel.findOne({ where: { chatId: chatId.toString() } })
  return ctx.replyWithMarkdown(
    `
Your name is ${first_name || ''} ${last_name || ''} 🙂 
Your results:
✅ Right: ${user?.dataValues.rightAnswers}
❌ Wrong: ${user?.dataValues.wrongAnswers}
  `.replace(/\n\t+/gm, ''),
    { parse_mode: 'HTML' }
  )
}

export function onText(ctx: any) {
  try {
    const {
      text,
      chat: { id: chatId }
    } = ctx.update.message
    if (text === '/game') {
      chats[chatId] = Math.floor(Math.random() * 10)
      return ctx.reply(`Try to guess number between 0 and 9.`, gameOptions)
    }
    return ctx.reply(`You sent me "${text}"`)
  } catch (e) {
    return ctx.reply('Something went wrong!')
  }
}

export async function onGameCallbackQuery(ctx: any) {
  const chatId = ctx.chat?.id || '1'
  const { data } = ctx.update.callback_query
  const user = await UserModel.findOne({ where: { chatId: chatId.toString() } })
  if (data === '/again') {
    chats[chatId] = Math.floor(Math.random() * 10)
    return ctx.reply(`Try to guess number between 0 and 9.`, gameOptions)
  }
  if (chatId && data === chats[chatId].toString()) {
    await user?.update({ rightAnswers: user?.dataValues.rightAnswers + 1 })
    return ctx.reply(`You chose ${data} 👍`, againOptions)
  } else {
    await user?.update({ wrongAnswers: user?.dataValues.wrongAnswers + 1 })
    return ctx.reply(`Please try to choose another one ☹`)
  }
}

export async function setBotCommands(bot: Telegraf) {
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Start shop bot.' },
    { command: 'help', description: 'Get your info from bot.' },
    { command: 'game', description: 'Start guess random number game.' }
  ])
}
