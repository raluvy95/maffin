module.exports = {
   name: "ping",
   mod: "util",
   run(message, args, client) {
       message.channel.send(Math.floor(client.ws.ping) + "ms")
   }
}

