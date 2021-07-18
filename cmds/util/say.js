module.exports = {
    name: "say",
    ownerOnly: true,
    run(message, args, client) {
        message.channel.send(args.join(" ")).then(() => {
            message.delete()
        })
    }
}
