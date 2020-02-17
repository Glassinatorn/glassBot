const {config} = require('dotenv');
const {TextChannel, WebhookClient, Client, RichEmbed} = require('discord.js');

const client = new Client({
    disableeveryone: true
});

config({
    path: __dirname + '/.token'
})

client.on('ready', () => {
    console.log("glassBot logged in!");
})

clean = (msg) => {
    msg.channel.fetchMessages({limit: 100})
        .then(messages => {
            var arr = messages.array();
            //to use when first cleaning phase is done in all channels
            //var toDelete = [];
            for (key in arr) {
                let contentExp = new RegExp("clean|news|test|clean|pling|ping" +
                    "|clean|!clean|!queue|stats|!play|!stop|!skip|!np|!pause" +
                    "|!resume|!leave|!replay|!rank|!levels|!r6tab|!raidbots" +
                    "|^skip|^queue|^np|^play|^clean|^stop|^pause|^resume" +
                    "|^replay"),
                    authorExp = new RegExp("Rythm|TabStats|Raidbots|glassBot|" +
                        "Yui");
                if (arr[key].content.match(contentExp) ||
                    arr[key].author.username.match(authorExp)) {
                    // replace with this one after first cleaning phase is done
                    //toDelete.push(arr[key].id);
                    arr[key].delete()
                        .then(console.log('deleted message'))
                        .catch(() => {
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
}

client.on('message', msg => {
    if (msg.content === 'clean') {
        clean(msg);
    }
});

client.login(process.env.botToken);
