module.exports = {
    name: "reddit",
    aliases: ["r"],
    cooldown: 3,
    mod: "reddit",
    desc: "Get some posts from specific subreddit",
    usage: "<subreddit name>",
    example: "funny",
    run(message, args, client) {
        if(!args[0]) return message.channel.send("Give me the subreddit name")
        const s = ["hot", "new"]
        let URL = `https://reddit.com/r/${args[0]}`
        if(s.includes(args[1])) {
            URL += `/${args[1].toLowerCase()}.json`
        } else {
            URL += "/hot.json"
        }
        const shitpost = Math.floor(Math.random() * s.length)
        client.f(URL).then(r => r.json())
        .then(res => {
            res = !res[0] || res.length == 0 ? res.data : res[0].data
            if(!res) return message.channel.send("It looks like there's no data or probably the subreddit is not found...")
            const pick = Math.floor(Math.random() * res.children.length) + 1
            if(!res.children[pick]) return message.channel.send("It looks like there's no data or probably the subreddit is not found...")
            const post = res.children[pick].data
            if(post["over_18"] && !message.channel.nsfw) return message.channel.send("Horny, NSFW post is not allowed in SFW channel...")
            post.permalink = "https://reddit.com" + post.permalink
            const e = new client.Embed()
            .setTitle(post.title)
            if(post.is_video) {
                e.setDescription(`[Video](${post.url})`)
                .setImage(post.thumbnail)
            } else if(post.selftext) {
                post.selftext = post.selftext.length >= 1500 ?
                                post.selftext.slice(0, 1500) + `... [more](${post.permalink})` :
                                post.selftext
                e.setDescription(post.selftext)
            } else {
                e.setDescription(`Not loading? Click [here](${post.url})`)
                if(post.gallery_data) post.url = `https://i.redd.it/${post.gallery_data.items[0].media_id}.jpg`
                e.setImage(post.url)
            }
            e.setFooter({text: `${post.ups} upvotes | Subreddit: ${post.subreddit_name_prefixed}`})
            .setURL(post.permalink)
            message.channel.send({embeds: [e]})
        }).catch(e => message.channel.send(`Oops... ${e}`))
} }
