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
            let arr = messages.array();
            //let toDelete = [];
            for (key in arr) {
                if (arr[key].content === 'clean' ||
                    arr[key].content === 'news' ||
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
                    arr[key].author.username === 'glassbot' ||
                    arr[key].author.username === 'Yui') {
                    // replace with this one after first cleaning is done
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
                        name: 'Article',
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
    } else if (msg.content === 'news') {
        getNews(msg.channel);
    }
});

client.login(process.env.botToken);
