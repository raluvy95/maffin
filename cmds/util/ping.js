module.exports = {
   name: "ping",
   mod: "util",
   slash: true,
   run(i, client) {
       i.reply(Math.floor(client.ws.ping) + "ms")
   }
}

