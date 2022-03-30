const jimp = require("jimp")

module.exports = {
    name: "ball",
    aliases: ["countryball", "cb"],
    mod: "imgen",
    cooldown: 5,
    description: "Turn your avatar into a countryball.",
    usage: "[mention]",
    example: "@catnowblue",
    run: async (message, args, client) => {
        let img = await client.fetchImg(message, args)
        if(!img) {
            img = message.author.avatarURL({format: "png", size: 256}) 
        }
        jimp.read(img)
        .then(async i => {
            const cb = await jimp.read("./assets/polandball.png")
            // fuck you discord for not resizing the pfp to 512.
            i.resize(cb.bitmap.height, cb.bitmap.width)
            i.composite(cb, 0, 0)
            i.getBuffer(jimp.MIME_JPEG, (err, b) => {
                message.channel.send({files: [b], content: "Here's your generated ball!"})
            })
        })
    }
}
