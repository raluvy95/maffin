const meme = require("@therealraluvy/memeinstall")

module.exports = {
    name: "meme",
    cooldown: 3,
    mod: "reddit",
    desc: "Get some posts from memes subreddit",
    run(message, args, client) {
        meme.getMeme(1).then(r => {
            const p = r.memes[0]
            const e = new client.Embed()
            .setImage(p.url)
            .setDescription(`[click here if not loading](${p.postLink})`)
            .setTitle(p.title)
            .setURL(p.postLink)
            .setFooter({text: `${p.ups} upvotes | Subreddit: ${p.subreddit}`})
            message.channel.send({embeds: [e]})
        })
    }
}
