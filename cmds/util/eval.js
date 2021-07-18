module.exports = {
    name: "eval",
    owner: true,
    run: async (message, args, client) => {
    const clean = text => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };

    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string") {
        evaled = require("util").inspect(evaled);
      }
      const output = clean(evaled)
      console.log(output.length)
      if(output.length > 1990) {
          const ogMsg = await message.channel.send(output.slice(0, 1990), {code: "js"})
          let ttt = (output.length - 1990) / 1990
          message.channel.send(`Continue? There's more \`${output.length - 1990}\` more characters (${ttt.toFixed(1)} messages will send) and might be flooding.`).then(async msg => {
              await msg.react("✅")
              await msg.react("📜")
              await msg.react("❌")
              await msg.react("🗑️")
              const filter = (r, u) => u.id == message.author.id
              const collect = msg.createReactionCollector(filter, {time: 15000})
              collect.on('collect', async rr => {
                  switch(rr.emoji.name) {
                      case '✅': {
                          let time = 2;
                          while(true) {
                              const text = output.slice(1990 * (time - 1), 1990 * time)
                              if(!text || text.length == 0) break;
                              await message.channel.send(text, {code: "js"})
                              time++
                          }
                          await msg.delete()
                          break;
                      }
                      case '❌':
                          await msg.delete()
                          break;
                      case '🗑️':
                          await msg.delete()
                          await ogMsg.delete()
                          break;
                      case '📜': {
                          let time = 2;
                          await msg.edit("Check your console!")
                          while(true) {
                              const text = output.slice(1990 * (time - 1), 1990 * time)
                              if(!text || text.length == 0) break;
                              console.log(text)
                              time++
                          }
                          break;
                      }
                 }
              })
              collect.on("end", async () => {
                  msg.reactions.removeAll()
              })
          })
      } else {
          const msg = await message.channel.send(output, { code: "js" })
          await msg.react('🗑️')
          const fitler = (r, u) => u.id == message.author.id
          const collect = msg.createReactionCollector(fitler, {time: 15000})
          collect.on("collect", async rr => {
             if(rr.emoji.name == "🗑️") {
                 await msg.delete()
             }
          })
          collect.on("end", async () => {
              msg.reactions.removeAll()
          })
      }
    } catch (err) {
      const msg = await message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      await msg.react('🗑️')
      const fitler = (r, u) => u.id == message.author.id == u.id
      const collect = msg.createReactionCollector(fitler, {time: 15000})
      collect.on("collect", async rr => {
          if(rr.emoji.name == '🗑') {
              await msg.delete()
          }
      })
      collect.on("end", () => {
          msg.reactions.removeAll()
      })
    }
  }
}
