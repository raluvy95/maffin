const Discord = require("discord.js")
const { Intents } = require("discord.js");
const config = require('../config.json');

class MaffinBot extends Discord.Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS
            ]
        })
        this.cooldowns = new Discord.Collection()
        this.cmds = new Discord.Collection()
        this.Embed = Discord.MessageEmbed
        this.prefix = config.prefix
    }
    
    /**
     * Get an HTTP request.
     * @param  {...any} args  
     */
    f(...args) {
        // fuck you node-fetch for killing require()
        return import('node-fetch').then(({ default: fetch }) => fetch(...args));
    }

    async getMember(message, args) {
        let member = message.mentions.members.first()
        if (!member) {
            const r = await message.guild.members.fetch()
            member = r.find(m =>
                m.user.username.toLowerCase() == args.join(" ").toLowerCase() ||
                m.nickname.toLowerCase() == args.join(" ").toLowerCase() ||
                m.user.id == args[0] ||
                m.user.tag.toLowerCase() == args.join(" ").toLowerCase()
            )
        }
        return member
    }

    async fetchImg(message, args) {
        const fromMsg = message.channel.messages.cache.filter(m => m.attachments.size > 0).last()?.attachments?.first()?.attachment
        const fromEmb = message.channel.messages.cache.filter(m => m.embeds[0]).last()?.embeds[0]?.image?.url
        const fromOwnMsg = message.attachments?.first()?.attachment
        const fromMention = message.mentions.users.first()?.avatarURL() || await this.getMember(message, args).user?.avatarURL()
        console.log(fromMention)
        return fromMention || fromOwnMsg || fromMsg || fromEmb
    }
}

module.exports = MaffinBot