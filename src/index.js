import Discord from 'discord.js'
import parse from './parser'
import controller from './controller'
const discordClient = new Discord.Client()

const users = {}

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.on('message', async msg => {
  const { args, command, author } = parse(msg)
  if (!command) return
  const response = controller({ command, users, author, msg, args })
  Object.keys(response).forEach(key => (users[key] = response[key]))
})

discordClient.login(process.env.DISCORD_TOKEN)
