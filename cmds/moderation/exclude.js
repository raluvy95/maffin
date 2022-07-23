const { PermissionsBitField } = require("discord.js")

module.exports = {
    name: "exclude",
    desc: "Exclude a member from this channel",
    mod: "moderation",
    isMod: true,
    async run(message, args, client) {
        const member = await client.getMember(message, args)
        if(!member) return message.channel.send("That member is not found or missing.")
        message.channel.permissionOverwrites.create(member, {
            "ViewChannel": false,
            "SendMessages": false
        }).then(() => {
            message.channel.send(`**${member}** has been excluded!`)
        })
    }
}