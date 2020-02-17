// package for getting data from dot-files https://www.npmjs.com/package/dotenv
const {config} = require('dotenv');
// wrapper for the discord API https://github.com/discordjs/discord.js
const {Client} = require('discord.js');
// request package for https://github.com/request/request-promise-native
const request = require('request-promise-native');
// jquery for nodejs https://www.npmjs.com/package/cheerio
const cheerio = require('cheerio');

const client = new Client({
    disableeveryone: true
});

config({
    path: __dirname + '/.token'
})

client.on('ready', () => {
    console.log("glassBot logged in!");
})

/*
 * Function to clean chats from bot commands
 * */
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
                    authorExp = new RegExp("Rythm|TabStats|Raidbots|glassbot|" +
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

/*
 * Function to gather and present gaming news
 * */
const getNews = (channel, search) => {
    let options = {
        uri: 'https://www.gamingna.com/search/' + search,
        transform: (body) => {
            return cheerio.load(body);
        }
    };

    request(options)
        .then(function (object) {
            let tmp = [];
            let from = 0;

            object('.out-link').each((i, item) => {
                // jumping to next index as the list has duplicates
                if ((i % 2) != 0) {
                    return;
                }

                if (i < 30) {
                    tmp.push({
                        name: 'Article:',
                        value: '[' + item.attribs['title'] +
                            '](https://gamingna.com' + item.attribs['href'] +
                            ')\n\n',
                        inline: true
                    })
                }
            });
            channel.send({
                embed: {
                    title: 'Gaming news',
                    fields: tmp
                }
            })
                .then(console.log(from))
                .catch(console.err);
        })
        .catch(function (err) {
            console.log(err);
        })
}

client.on('message', msg => {
    if (msg.content === 'clean') {
        clean(msg);
    } else if (msg.content.includes('news')) {
        let strings = msg.content.split(' '),
            search = '';
        for (let i = 0; i < strings.length; i++) {
            if (i > 0) {
                search += strings[i] + ' ';
            }
        }
        console.log(search);
        getNews(msg.channel, search);
    }
});

client.login(process.env.botToken);
