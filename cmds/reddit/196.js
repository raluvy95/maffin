const f = require("node-fetch");

module.exports = {
    name: "196",
    aliases: ["shitty"],
    cooldown: 3,
    mod: "reddit",
    run(message, args, client) {
        const s = ["hot", "new"]
        const shitpost = Math.floor(Math.random() * s.length)
        f(`https://reddit.com/r/196/${s[shitpost]}.json`).then(r => r.json())
        .then(res => {
            res = !res[0] ? res.data : res[0].data
            const pick = Math.floor(Math.random() * res.children.length) + 2
            const post = res.children[pick].data
            const e = new client.Embed()
            .setTitle(post.title)
            if(post.is_video) { e.setDescription(`[Video](${post.url})`) }
            else { e.setImage(post.url) }
            e.setFooter(`${post.ups} upvotes | Subreddit: ${post.subreddit_name_prefixed}`)
            .setTimestamp(post.created_utc)
            .setURL("https://reddit.com" + post.permalink)
            message.channel.send(e)
        }).catch(e => message.channel.send(`Oops... ${e}`))
    }
}
