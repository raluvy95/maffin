const { GatewayIntentBits, Collection, Client } = require("discord.js");
const config = require('../config.json');
const MaffinEmbed = require("./Embed");

class MaffinBot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.Guilds,
                // fuck you Discord for making MessageContent a "privacy nightmare for users"
                // I won't plan to use your shitty slash command that will actually
                // hurt developers and users too. LISTEN TO YOUR FEEDBACK PLEASE

                // let developers do whatever shit with their bot
                GatewayIntentBits.MessageContent
            ],
            ws: {
                properties: {
                    $browser: "Discord iOS"
                }
            },
            allowedMentions: { parse: ["users"] }
        })
        this.cooldowns = new Collection()
        this.cmds = new Collection()
        this.Embed = MaffinEmbed
        this.prefix = null
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
                m.user?.username?.toLowerCase() == args.join(" ").toLowerCase() ||
                m.nickname?.toLowerCase() == args.join(" ").toLowerCase() ||
                m.user?.id == args[0] ||
                m.user?.tag?.toLowerCase() == args.join(" ").toLowerCase()
            )
        }
        return member
    }

    async fetchImg(message, args) {
        const fromMsg = message.channel.messages.cache.filter(m => m.attachments.size > 0).last()?.attachments?.first()?.attachment
        const fromEmb = message.channel.messages.cache.filter(m => m.embeds[0]).last()?.embeds[0]?.image?.url
        const fromOwnMsg = message.attachments?.first()?.attachment
        const fromMention = message.mentions.users.first()?.avatarURL({ forceStatic: true }) || await this.getMember(message, args).user?.avatarURL({ forceStatic: true })
        console.log(fromMention)
        return fromMention || fromOwnMsg || fromMsg || fromEmb
    }
}

module.exports = MaffinBot
