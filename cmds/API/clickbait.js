module.exports = {
   name: "clickbait",
   cooldown: 3,
   desc: "Clickbait title generator",
   run(message, args, client) {
       client.f("https://clickbait-generator.herokuapp.com/api").then(r => r.json())
       .then(res => {
           const e = new client.Embed()
           .setTitle("Clickbait Generator")
           .setColor("RANDOM")
           .setDescription(res.title)
           message.channel.send({embeds: [e]})
       })
   }
}
