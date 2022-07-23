const { EmbedBuilder } = require("@discordjs/builders");

class MaffinEmbed extends EmbedBuilder {
    constructor() {
        super()
    }
    
    // Discord.js removed the most useful function...
    addField(name, value, inline=false) {
        this.addFields([{name, value, inline}])
        return this
    }
}

module.exports = MaffinEmbed