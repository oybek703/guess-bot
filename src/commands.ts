import { againOptions, gameOptions } from './options'
import { Telegraf } from 'telegraf'

const chats: { [key: number]: number } = {}

export function startCommand(ctx: any) {
  const { first_name, last_name } = ctx.update.message.from
  return ctx.reply(`Hi ${first_name || ''} ${last_name || ''} 🖐. Welcome to shop bot🙂`)
}

export function helpCommand(ctx: any) {
  const { first_name, last_name } = ctx.update.message.from
  return ctx.reply(`Your name is ${first_name || ''} ${last_name || ''}🙂`)
}

export function onText(ctx: any) {
  const {
    text,
    chat: { id: chatId }
  } = ctx.update.message
  if (text === '/game') {
    chats[chatId] = Math.floor(Math.random() * 10)
    return ctx.reply(`Try to guess number between 0 and 9.`, gameOptions)
  }
  return ctx.reply(`You sent me "${text}"`)
}

export function onGameCallbackQuery(ctx: any) {
  const chatId = ctx.chat?.id || '1'
  const { data } = ctx.update.callback_query
  if (data === '/again') {
    chats[chatId] = Math.floor(Math.random() * 10)
    return ctx.reply(`Try to guess number between 0 and 9.`, gameOptions)
  }
  if (chatId && data === chats[chatId].toString()) {
    return ctx.reply(`You chose ${data} 👍`, againOptions)
  } else {
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
