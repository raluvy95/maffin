module.exports = {
   name: "ping",
   aliases: ["pong"],
   mod: "util",
   desc: "Pong!",
   run(message, args, client) {
       message.channel.send(Math.floor(client.ws.ping) + "ms")
   }
}

