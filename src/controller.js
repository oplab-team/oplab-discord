import { OplabClient, MetabaseClient } from './client'

const controller = async request => {
  const { command, users, author, msg, args } = request
  console.log(request)
  switch (command) {
  case 'ping': {
    msg.reply('Pong!')
    break
  }
  case 'activeusers': {
    const metabase = new MetabaseClient()
    await metabase.login(process.env.METABASE_USERNAME, process.env.METABASE_PASSWORD)
    msg.reply(`existem **${await metabase.getCard(12)}** usuários ativos no Oplab!`)
    break
  }
  case 'token': {
    users[author] = { ...users[author], token: args[0] }
    msg.reply(
      `o seu token foi ${users[author] && users[author].token ? 'atualizado' : 'adicionado'}!`
    )
    break
  }
  case 'quote': {
    if (args.length === 0) {
      msg.reply(
        'você precisa especificar qual(is) cotação(ões) você quer. Exemplo: **+quote petr4 itub4**'
      )
    } else {
      const oplab = new OplabClient()
      try {
        const quotes = await oplab.getStudies(args)
        const reply = `as cotações são as seguintes:\n${quotes
          .map(
            ({ target: { symbol, close, variation } }) =>
              `${
                variation >= 0 ? ':green_circle:' : ':red_circle:'
              } ${symbol}: **R$${close}** | *(${(variation).toFixed(2)}%)*`
          )
          .join('\n')}`
        msg.reply(reply)
      } catch (e) {
        msg.reply(
          'teve algum problema na hora de buscar as cotações. Será que você escreveu certo?'
        )
      }
    }
    break
  }
  default: {
    msg.reply('esse comando não existe, ainda.')
  }
  }

  return { command, users, author, msg, args }
}

export default controller
