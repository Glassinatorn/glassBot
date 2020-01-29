const { config } = require('dotenv');
const { WebhookClient, Client, RichEmbed } = require('discord.js');

const client = new Client ({
    disableeveryone: true
});

config({
    path: __dirname + '/.token'
})

client.on('ready', () => {
    console.log("glassBot logged in!");
})

clean = (channel) => {
    console.log(channel.messages);
}

client.on('message', msg => {
    if (msg.content === "ping") {
        msg.reply('pong');
    } else if (msg.content === 'embed') {
        const embed = new RichEmbed()
            .setTitle('A slick little embed')
            .setColor(0xFF0000)
            .setDescription('testing');
        msg.channel.send(embed);
    } else if (msg.content === 'clean') {
        hook.send('hook alive')
            .then(msg => {
                console.log('sent message through webhook');
            })
            .catch(console.error);
    }
});

client.login(process.env.botToken);
const hook = new WebhookClient(process.env.hookID, process.env.hookToken);
