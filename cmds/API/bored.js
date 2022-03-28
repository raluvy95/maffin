module.exports = {
    name: "bored",
    cooldown: 2,
    mod: "API",
    desc: "No idea what you're doing right now? Use this command!",
    run(message, args, client) {
        client.f("http://www.boredapi.com/api/activity/").then(r => r.json())
        .then(r => {
            const e = new client.Embed()
            .setDescription(r.activity)
            .setURL(r.link)
            .setTitle(`Type: ${r.type} | Price: ${r.price}`)
            .setFooter(`Participants: ${r.participants}`)
            message.channel.send({embeds: [e]})
        })
    }
}
