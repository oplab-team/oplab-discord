import dotenv from 'dotenv'
dotenv.config()
import Discord from 'discord.js'
import OplabClient from './client'

const COMMAND_PREFIX = process.env.COMMAND_PREFIX
const DISCORD_TOKEN = process.env.DISCORD_TOKEN


const discordClient = new Discord.Client()

const users = {}

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.on('message', async msg => {
    if (!msg.content.startsWith(COMMAND_PREFIX)) return
    
    const args = msg.content.slice(COMMAND_PREFIX.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const author = msg.author.username
    
    switch (command){
        case 'ping': msg.reply('Pong!')
        case 'token':
            const action = users[author] && users[author].token ? 'atualizado' : 'adicionado'
            users[author] = {...users[author], token: args[0]}
            msg.reply(`o seu token foi ${action}!`)
            console.log(users)
            break
        case 'quote':
            if(args.length === 0) {
                return msg.reply('você precisa especificar qual(is) cotação(ões) você quer. Exemplo: **+quote petr4 itub4**')
            } else {
                const oplab = new OplabClient()
                try {
                    const quotes = await oplab.getStudies(args)
                    const reply = `as cotações são as seguintes:\n${
                        quotes.map(({target: {symbol, close}}) => `- ${symbol}: R$${close}`).join('\n')
                    }`
                    msg.reply(reply)
                } catch (e){
                    console.log(e)
                    msg.reply('teve algum problema na hora de buscar as cotações. Será que você escreveu certo?')
                }
            }
            break
        default:
            msg.reply('esse comando não existe, ainda.')
    }
})

discordClient.login(DISCORD_TOKEN)


