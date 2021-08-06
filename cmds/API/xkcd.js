module.exports = {
    name: "xkcd",
    cooldown: 2,
    mod: "API",
    run(message, args, client) {
        let rand = args[0]
        if(!rand) {
           rand = Math.floor(Math.random() * 2300) + 1
        } else if(rand.toLowerCase() == "l" ||
                  rand.toLowerCase() == "latest") {
           rand = null
        }
        client.f(`https://xkcd.com/${!rand ? '' : rand + '/' }info.0.json`).then(r => r.json())
        .then(res => {
            const e = new client.Embed()
            .setTitle(res.safe_title)
            .setDescription(res.alt)
            .setImage(res.img)
            .setFooter(`Number: ${res.num}`)
            .setColor("RANDOM")
            message.channel.send({embeds: [e]})
        }).catch(e => message.channel.send(`It looks like the API did an oppsie:\n${e}`))
    }
}
