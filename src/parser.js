const parse = msg => {
  if (!msg.content.startsWith(process.env.COMMAND_PREFIX))
    return { args: null, command: null, author: null, msg }

  const args = msg.content.slice(process.env.COMMAND_PREFIX.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const author = msg.author.username

  return { args, command, author, msg }
}

export default parse
