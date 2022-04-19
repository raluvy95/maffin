module.exports = {
    name: "dislike",
    mod: "API",
    cooldown: 5,
    run(message, args, client) {
        if(!args[0]) {
           return message.channel.send("Please provide the link to youtube video for display dislikes count.")
        }
        function youtube_parser(url){
            const regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
            const match = url.match(regExp);
            return (match && match[1].length==11)? match[1] : false;
        }
        if(!youtube_parser(args[0])) return message.channel.send("That's not a youtube url.")
        client.f(`https://returnyoutubedislikeapi.com/votes?videoId=${youtube_parser(args[0])}`).then(r => r.json()).then(j => {
            const total_rating = j.likes + j.dislikes
            const average_count = Math.floor(j.viewCount / total_rating)
            return message.channel.send(`This video has \`${total_rating.toLocaleString()}\` total rating and \`${j.viewCount.toLocaleString()}\` views (1 rate per **${average_count}** views).
            It also has \`${j.likes.toLocaleString()}\` likes and \`${j.dislikes.toLocaleString()}\` dislikes.`)
            // TODO: adds average under 5-star rating system
        })
    }
}