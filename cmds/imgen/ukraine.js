const jimp = require("jimp")

module.exports = {
    name: "ukraine",
    mod: "imgen",
    cooldown: 5,
    usage: "[mention]",
    example: "@catnowblue",
    desc: "Put Ukrainian flag in your avatar's border.",
    run(message, args, client) {
        let author = message.mentions.users.first()
        if(!author) {
            author = message.author
        }
        jimp.read(author.avatarURL({format: "png", size: 512}))
        .then(async i => {
            const ua = await jimp.read("./assets/ukraine.png")
            i.composite(ua, 0, 0)
            i.getBuffer(jimp.MIME_PNG, (err, b) => {
                message.channel.send({files: [b], content: "Here's your generated avatar!"})
            })
        })
    }
}