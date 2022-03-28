const jimp = require("jimp")

module.exports = {
    name: "ball",
    aliases: ["countryball", "cb"],
    mod: "imgen",
    cooldown: 5,
    description: "Turn your avatar into a countryball.",
    usage: "[mention]",
    example: "@catnowblue",
    run(message, args, client) {
        let author = message.mentions.users.first()
        if(!author) {
            author = message.author
        }
        jimp.read(author.avatarURL({format: "png", size: 256}))
        .then(async i => {
            const cb = await jimp.read("./assets/polandball.png")
            i.composite(cb, 0, 0)
            i.getBuffer(jimp.MIME_JPEG, (err, b) => {
                message.channel.send({files: [b], content: "Here's your generated ball!"})
            })
        })
    }
}