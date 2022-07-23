module.exports = {
	name: "membercount",
	aliases: ["members", "memberscount"],
	mod: "util",
	desc: "Count current members in this server (including details)",
	run: async (message, _, client) => {
		const accurateCount = message.guild.memberCount
		let cached = message.guild.members.cache
		if (accurateCount != cached.size) {
			cached = await message.guild.members.fetch()
		}
		const bots = cached.filter(m => m.user.bot).size
		const users = cached.filter(m => !m.user.bot).size
		const e = new client.Embed()
			.setTitle(`There are ${accurateCount} members`)
			.setDescription(`Bots: ${bots}\nPeople: ${users}`)
		message.channel.send({ embeds: [e] })
	}
}
