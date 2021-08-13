const { MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs")
module.exports = {
    name: "eval",
    owner: true,
    run: async (message, args, client) => {
        const clean = text => {
            if (typeof text === "string")
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };

        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }
            const output = clean(evaled)
            console.log(output.length)
            if (output.length > 1990) {
                const ogMsg = await message.channel.send(output.slice(0, 1990), { code: "js" })
                let ttt = (output.length - 1990) / 1990
                /*
                fs.mkdir("./cache", () => {
                    fs.writeFileSync(`./cache/evaled-${Number(new Date().getTime() / 1000).toFixed()}.txt`, output)
                })
                const btn = new MessageActionRow()
                const btns = btn.addComponents(
                    new MessageButton()
                    .setCustomId('accept')
                    .setEmoji('✅')
                    .setStyle("PRIMARY"),
                    new MessageButton()
                    .setCustomId('logging')
                    .setEmoji('📜')
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId('reject')
                    .setEmoji('❌')
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setStyle("SECONDARY")
                )
                 SUPPORT FOR BUTTONS WHEN DISCORD.JS SUPPORT ACTUALLY HELPS ME WITH THE FOLLOWING ISSUE:
                    - DELETE THE MESSAGE AFTER THE BUTTON IS PRESSED
                    - CONTINUE SENDING MESSAGES AFTER THE BUTTON IS PRESSED
                    - HOLDS THE DATA WITHOUT CREATING A CACHED FILE
                */
                message.channel.send({ content: 
                    `Continue? There's more \`${output.length - 1990}\` more characters (${ttt.toFixed(1)} messages will send) and might be flooding.`,
                    // components: [btns] SUPPORT FOR BUTTONS 
                })
                    .then(async msg => {
                        // OLD VERSION
                        await msg.react("✅").catch(() => {})
                        await msg.react("📜").catch(() => {})
                        await msg.react("❌").catch(() => {})
                        await msg.react("🗑️").catch(() => {})
                        const filter = (r, u) => u.id == message.author.id
                        const collect = msg.createReactionCollector({ filter: filter, time: 15000 })
                        collect.on('collect', async rr => {
                            switch (rr.emoji.name) {
                                case '✅': {
                                    let time = 2;
                                    while (true) {
                                        const text = output.slice(1990 * (time - 1), 1990 * time)
                                        if (!text || text.length == 0) break;
                                        await message.channel.send(text, { code: "js" }).catch(() => {})
                                        time++
                                    }
                                    await msg.delete().catch(() => {})
                                    break;
                                }
                                case '❌':
                                    await msg.delete().catch(() => {})
                                    break;
                                case '🗑️':
                                    await msg.delete().catch(() => {})
                                    await ogMsg.delete().catch(() => {})
                                    break;
                                case '📜': {
                                    let time = 2;
                                    await msg.edit("Check your console!")
                                    while (true) {
                                        const text = output.slice(1990 * (time - 1), 1990 * time)
                                        if (!text || text.length == 0) break;
                                        console.log(text)
                                        time++
                                    }
                                    break;
                                }
                            }
                        })
                        collect.on("end", async () => {
                            msg.reactions.removeAll().catch(() => {})
                        })
                    })
            } else {
                const btn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setStyle("SECONDARY")
                )
                const msg = await message.channel.send({ content: "```js\n" + output + "\n```", components: [btn]})

            }
        } catch (err) {
            const btn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setStyle("SECONDARY")
                )
            const msg = await message.channel.send({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, components: [btn] });
        }
    }
}
