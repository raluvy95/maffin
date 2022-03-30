const jimp = require("jimp")

module.exports = {
    name: "ukraine",
    mod: "imgen",
    cooldown: 5,
    usage: "[mention]",
    example: "@catnowblue",
    desc: "Put Ukrainian flag in your avatar's border.",
    run: async (message, args, client) => {
        let img = await client.fetchImg(message, args)
        if(!img) {
            img = message.author.avatarURL({format: "png", size: 512}) 
        }
        jimp.read(img)
        .then(async i => {
            const ua = await jimp.read("./assets/ukraine.png")
            // fuck you discord for not resizing the pfp to 512.
            i.resize(ua.bitmap.height, ua.bitmap.width)
            i.composite(ua, 0, 0)
            i.getBuffer(jimp.MIME_PNG, (err, b) => {
                message.channel.send({files: [b], content: "Here's your generated avatar!"})
            })
        })
    }
}
