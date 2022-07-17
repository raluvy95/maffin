module.exports = {
    name: "exclude",
    desc: "Exclude a member from this channel",
    mod: "moderation",
    isMod: true,
    async run(message, args, client) {
        const member = await client.getMember(message, args)
        if(!member) return message.channel.send("That member is not found or missing.")
        message.channel.permissionOverwrites.create(member, {
            "VIEW_CHANNEL": false,
            "SEND_MESSAGES": false
        }).then(() => {
            message.channel.send(`**${member}** has been excluded!`)
        })
    }
}