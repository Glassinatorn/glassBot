const { config } = require('dotenv');
const { TextChannel, WebhookClient, Client, RichEmbed } = require('discord.js');

const client = new Client ({
    disableeveryone: true
});

config({
    path: __dirname + '/.token'
})

client.on('ready', () => {
    console.log("glassBot logged in!");
})

clean = (msg) => {
    const filter = m => m.content.includes('c');
    const collector = msg.channel.createMessageCollector(filter, {time: 15000});
    msg.channel.fetchMessages({limit: 100})
        .then(messages => {
            var arr = messages.array();
            var toDelete = [];
            for (key in arr) {
                if (arr[key].content === 'clean' ||
                    arr[key].content === 'pling' ||
                    arr[key].content === 'ping' ||
                    arr[key].content === 'clean' ||
                    arr[key].content.includes('!clean') ||
                    arr[key].content.includes('!queue') ||
                    arr[key].content.includes('!stats') ||
                    arr[key].content.includes('!play') ||
                    arr[key].content.includes('!stop') ||
                    arr[key].content.includes('!skip') ||
                    arr[key].content.includes('!np') ||
                    arr[key].content.includes('!pause') ||
                    arr[key].content.includes('!resume') ||
                    arr[key].content.includes('!leave') ||
                    arr[key].content.includes('!replay') ||
                    arr[key].content.includes('!rank') ||
                    arr[key].content.includes('!levels') ||
                    arr[key].content.includes('!r6tab') ||
                    arr[key].content.includes('!raidbots') ||
                    arr[key].content.includes('^skip') ||
                    arr[key].content.includes('^queue') ||
                    arr[key].content.includes('^np') ||
                    arr[key].content.includes('^play') ||
                    arr[key].content.includes('^clean') ||
                    arr[key].content.includes('^stop') ||
                    arr[key].content.includes('^pause') ||
                    arr[key].content.includes('^resume') ||
                    arr[key].content.includes('^replay') ||
                    arr[key].author.username === 'Rythm' ||
                    arr[key].author.username === 'TabStats' ||
                    arr[key].author.username === 'Raidbots' ||
                    arr[key].author.username === 'glassBot' ||
                    arr[key].author.username === 'Yui')
                {
                    // replace with this one after first cleaning is done
                    //toDelete.push(arr[key].id);
                    arr[key].delete()
                        .then(console.log('deleted message'))
                        .catch( () => {
                            if (arr[key].deletable) {
                                arr[key].delete()
                                    .then(console.log('deleted message'))
                                    .catch(console.log('still can not delete'));
                            }
                            console.log(arr[key]);
                        });
                }
                //msg.channel.bulkDelete(toDelete);
            }
        })
        .catch(console.error);

    // placeholder for what to send back
    return collector.size;
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
        if (msg.channel.type === 'text') {
            clean(msg);
        } else {
            msg.reply('Not a channel I can clean');
        }
    }
});

client.login(process.env.botToken);
const hook = new WebhookClient(process.env.hookID, process.env.hookToken);
