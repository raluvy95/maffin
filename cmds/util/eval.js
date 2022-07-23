const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js/src");
const fs = require("fs")
module.exports = {
    name: "eval",
    owner: true,
    run: async (message, args) => {
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
            if (output.length > 1990) {
                await message.channel.send(output.slice(0, 1990), { code: "js" })
                let ttt = (output.length - 1990) / 1990
                fs.mkdir("./cache", () => {
                    fs.writeFileSync(`./cache/evaled.txt`, output)
                })
                const btn = new ActionRowBuilder()
                const btns = btn.addComponents(
                    new ButtonBuilder()
                    .setCustomId('accept')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId('logging')
                    .setEmoji('📜')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('reject')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('file')
                    .setEmoji('📄')
                    .setStyle(ButtonStyle.Secondary)

                )
                /*
                 SUPPORT FOR BUTTONS WHEN DISCORD.JS SUPPORT ACTUALLY HELPS ME WITH THE FOLLOWING ISSUE:
                    - DELETE THE MESSAGE AFTER THE BUTTON IS PRESSED
                    - CONTINUE SENDING MESSAGES AFTER THE BUTTON IS PRESSED
                    - HOLDS THE DATA WITHOUT CREATING A CACHED FILE
                */
                await message.channel.send({ content: 
                    `Continue? There's more \`${output.length - 1990}\` more characters (${ttt.toFixed(1)} messages will send) and might be flooding.`,
                    components: [btns]
                })
                        /* OLD VERSION
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
                        */
            } else {
                const btn = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setStyle(ButtonStyle.Secondary),
                )
                await message.channel.send({ content: "```js\n" + output + "\n```", components: [btn]})

            }
        } catch (err) {
            const btn = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setStyle(ButtonStyle.Secondary)
                )
            await message.channel.send({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, components: [btn] });
        }
    }
}
