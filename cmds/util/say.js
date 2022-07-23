module.exports = {
    name: "say",
    ownerOnly: true,
    run(message, args) {
        message.channel.send(args.join(" ")).then(() => {
            message.delete()
        })
    }
}
