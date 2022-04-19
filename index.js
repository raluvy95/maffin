const Discord = require("discord.js")
const MaffinBot = require("./utils/Client.js")
const client = new MaffinBot()
const chalk = require("chalk")

const fs = require("fs");
let Parser = require("rss-parser");
let parser = new Parser();
const config = require('./config.json');

let previousVidId;
fs.rm("./cache", { recursive: true }, (err) => { })
fs.open("previousVidID.json", 'r', function (err, fd) {
    if (err) {
        fs.writeFile("previousVidId.json", "[]", function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
});

const modules = fs.readdirSync("./cmds")
    .filter(m => !m.startsWith("_"))
for (const m of modules) {
    const c = fs.readdirSync(`./cmds/${m}/`)
        .filter(f => !f.startsWith("_"))
    for (const cmds of c) {
        try {
            const command = require(`./cmds/${m}/${cmds}`)
            client.cmds.set(command.name, command)
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
    if (config.bumpReminder && message.interaction?.commandName == "bump" && message.author.id == "302050872383242240") {
        message.channel.send(`I will remind you to bump again in two hours!`)
        setTimeout(() => message.channel.send("Hey <@&959024808505532436>, reminder to `/bump` again!"), 7200000)
        return
    }
    if (message.channel.id == "829315052557041734" && message.author.bot) {
        // Auto-Publish to yt announcements
        message.crosspost()
        return
    }
    if (message.author.bot || message.channel.type == "dm") return;
    if (message.content.toLowerCase().startsWith("ree") && config.enableREE) return message.channel.send("REEEEEEEEEEE")
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
                setTimeout(() => msg.delete(), 2000);
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

if (config.autopost.enable) {
    setInterval(() => {
        const subreddits = config.autopost.subredditsToFollow
        const piii = Math.floor(Math.random() * subreddits.length)
        client.f(`https://reddit.com/r/${subreddits[piii]}/hot.json`).then(r => r.json())
            .then(res => {
                res = !res[0] ? res.data : res[0].data
                res = res.children.filter(m => !m.data.is_video && !m.data["over_18"])
                if (res.length < 1) return;
                const pick = Math.floor(Math.random() * res.length) + 1
                const post = res[pick].data
                const e = new client.Embed()
                    .setTitle(post.title)
                if (post.selftext) {
                    post.selftext = post.selftext.length >= 1500 ?
                        post.selftext.slice(0, 1500) + `... [more](${post.permalink})` :
                        post.selftext
                    e.setDescription(post.selftext)
                } else {
                    e.setDescription(`Not loading? Click [here](${post.url})`)
                    if (post.gallery_data) post.url = `https://i.redd.it/${post.gallery_data.items[0].media_id}.jpg`
                    e.setImage(post.url)
                }
                e.setURL("https://reddit.com" + post.permalink)
                    .setColor("RANDOM")
                if (post.is_video) { e.setDescription(`[Video](${post.url})`) }
                else { e.setImage(post.url) }
                client.channels.fetch(config.autopost.channelID).then(r => {
                    r.send({ embeds: [e] }).then(msg => {
                             if(msg.channel.type == "GUILD_NEWS") {
                                 msg.crosspost()
                             }
                         })
                        .catch(() => { })
                })
            }).catch(() => { })
    }, config.autopost.intervalInMinutes * 1000 * 60)
}
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
