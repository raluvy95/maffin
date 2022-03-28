const Discord = require("discord.js")
const { Intents } = require("discord.js");
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
const chalk = require("chalk")
const fetch = require("node-fetch");
const fs = require("fs");
let Parser = require("rss-parser");
let parser = new Parser();
const config = require('./config.json');

let previousVidId;
fs.rm("./cache", { recursive: true }, (err) => {

})
fs.open("previousVidID.json", 'r', function (err, fd) {
    if (err) {
        fs.writeFile("previousVidId.json", "[]", function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
});

client.cooldowns = new Discord.Collection()
client.cmds = new Discord.Collection()
client.slash = new Discord.Collection()
client.Embed = Discord.MessageEmbed
client.f = fetch;
client.prefix = config.prefix

const modules = fs.readdirSync("./cmds")
    .filter(m => !m.startsWith("_"))
for (const m of modules) {
    const c = fs.readdirSync(`./cmds/${m}/`)
        .filter(f => !f.startsWith("_"))
    for (const cmds of c) {
        try {
            const command = require(`./cmds/${m}/${cmds}`)
            if (command.slash) client.slash.set(command.name, command)
            else client.cmds.set(command.name, command)
            console.log(chalk.gray(`${cmds} loaded!`))
        } catch (e) {
            console.error(chalk.redBright(`It looks like the command ${cmds} did an oppsie!\n${e}`))
            console.error(chalk.redBright("But other commands will continue loading"))
            continue
        }
    }
}

client.on("ready", () => {
    console.log(chalk.greenBright("Ready!"));
    client.user.setActivity(config.playingStatus);
    previousVidId = require('./previousVidId.json');
});

// spaghetti code

client.on("debug", info => {
    if (info.includes("Heartbeat")) return
    else if (info.includes("[CONNECT]")) console.log(chalk.yellowBright(info))
    else if (info.includes("[CONNECTED]")) console.log(chalk.greenBright(info))
    else if (info.includes("[IDENTIFY]")) console.log(chalk.blueBright(info))
    else if (info.includes("[READY]")) console.log(chalk.bgGreenBright.black(info))
    else console.log(info)
})

client.on("guildMemberAdd", member => {
    if (member.guild.id != config.nick.guildID) return;
    try {
        const nickname = config.nick.name
        const shortUser = member.user.username.slice(0, 36 - nickname.length);
        const newUser = config.nick.name.replace("{user}", shortUser)
        member.setNickname(newUser)
    } catch (e) {
        console.log(e)
    }
})

client.on("guildMemberUpdate", (oldM, newM) => {
    if (oldM.nickname != newM.nickname) {
        if (newM.nickname.toLowerCase().startsWith("catnow")) return;
        const nick = config.nick.name
        const shortNick = newM.nickname.slice(0, 36 - nick.length);
        const newUser = config.nick.name.replace("{user}", shortNick)
        newM.setNickname(newUser)
    }
})

// this is command
client.on("messageCreate", message => {
    if (message.author.bot || message.channel.type == "dm") return;
    if (message.content.toLowerCase().startsWith("ree") && config.enableREE) return message.channel.send("REEEEEEEEEEE")
    if (message.content.toLowerCase().startsWith("!d bump") || message.interaction?.commandName == "bump") {
        const filter = m => m.author.id == "302050872383242240"
        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(c => {
                const first = c.first()
                if (config.bumpReminder && first.embeds[0]?.image == "https://disboard.org/images/bot-command-image-bump.png") {
                    message.channel.send(`Hey <@!${message.author.id}>, I will remind you to bump again in two hours!`);
                    setTimeout(() => message.channel.send(`Hey <@!${message.author.id}>, reminder to \`!d bump\` or \`/bump\`!`), 7200000);
                }
            })
            .catch(() => { })
    }
    if (config.enableSudo) {
        // something like an easter egg lol
        if (message.content.startsWith("sudo rm -rf")) {
            return message.channel.send(`I'm going to remove the folder \`${message.content.slice(12)}\`...`).then(r => {
                setTimeout(() => r.edit(`\`${message.content.slice(12)}\` has been removed!`), 3000)
            })
        } else if (message.content.startsWith("sudo shutdown")) {
            return message.channel.send("Shutting down...")
        }
    }
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/)
    const cmdName = args.shift().toLowerCase()
    const command = client.cmds.get(cmdName) || client.cmds.find(m => m.aliases && m.aliases.includes(cmdName))
    if (!command) return;
    const owners = config.owners
    if (command.owner && !owners.includes(message.author.id)) return message.channel.send("No");
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamp = client.cooldowns.get(command.name);
    const ca = (command.cooldown || 3) * 1000;
    if (timestamp && timestamp.has(message.author.id)) {
        const et = timestamp.get(message.author.id) + ca;
        if (now < et) {
            const te = (et - now) / 1000;
            message.react("⌛");
            return message.reply(
                `Command is on cooldown! \`${te.toFixed(1)}\` seconds left!`
            ).then(msg => {
                msg.delete({ timeout: 2000 });
            });
        }
    }
    timestamp.set(message.author.id, now);
    setTimeout(() => {
        timestamp.delete(message.author.id);
    }, ca);
    try {
        command.run(message, args, client)
    } catch (e) {
        return message.channel.send(`It looks like the command did an oppsie\n${e}`)
    }
})

const wait = require('util').promisify(setTimeout);

client.on("interactionCreate", async i => {
    if (i.isButton()) {
        try {
            switch (i.customId) {
                case 'accept':
                    fs.readFile("./cache/evaled.txt", async (err, data) => {
                        output = data.toString()
                        let ttt = (output.length - 1990) / 1990
                        let time = 2;
                        while (true) {
                            const text = output.slice(1990 * (time - 1), 1990 * time)
                            if (!text || text.length == 0) break;
                            await i.message.channel.send(text, { code: "js" }).catch(() => { })
                            time++
                        }
                        fs.rmSync("./cache/evaled.txt")
                    })
                    await i.message.delete().catch(() => { })
                    break;
                case 'reject':
                    i.message.delete()
                    break
                case 'logging':
                    i.update({ content: "Check your console output!", components: [] })
                    fs.readFile("./cache/evaled.txt", async (err, data) => {
                        output = data.toString()
                        console.log(output)
                        fs.rmSync("./cache/evaled.txt")
                    })
                    break
                case 'delete':
                    i.message.delete()
                    break
                case 'file':
                    i.update({ content: "Here's the file!", components: [] })
                    i.message.channel.send({ files: [`${__dirname}/cache/evaled.txt`] })
            }
        } catch (err) {
            await i.followUp()
            i.message.channel.reply(`${err}`).catch(() => { })
        }
    }
})
/*
setInterval(function () {
    parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${config.ytNotifs.ytChannelId}`).then(vidsJson => {
        if (vidsJson.items[0].id != previousVidId[0]) {
            let notifMsg = config.ytNotifs.notifMsg;
            notifMsg = notifMsg.replace("{author}", vidsJson.items[0].author);
            notifMsg = notifMsg.replace("{url}", vidsJson.items[0].link);
            try {
                client.channels.cache.get(config.ytNotifs.notifsChannelId).send(notifMsg, { disableMentions: "none" });
            } catch (err) {
                console.log("Failed to send Youtube notification message!\n" + err);
            };
            previousVidId[0] = vidsJson.items[0].id;
            fs.writeFile('./previousVidId.json', JSON.stringify(previousVidId), 'utf8', function (err) {
                if (err) return console.log(err);
            });
        };
    }).catch(err => {
        // skipped
    });
}, config.ytNotifs.newVidCheckIntervalInMinutes * 60000);
*/

process.on('uncaughtException', function (err) {
    console.log("Got an uncaught exception!")
    try {
        fs.appendFileSync(`./logs/${Date.now()}.log`, String(err))
    } catch {
        console.error(err)
    }
});

client.login(config.token)
