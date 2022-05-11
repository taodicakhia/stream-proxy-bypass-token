const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const flussonic = require('./plugins/flussonic');
const app = express();


function afghanlivetvchannels_com(res, url) {
    request(url, (error, response, body) => {
        if (error) {
            res.status(500).send(error);
        }
        else {
            const $ = cheerio.load(body);
            const link_stream = $('iframe').attr('src');
            const path = link_stream.replace(/(http|https)\:\/\//g, '').replace('embed.html', 'index.m3u8').replace(/\&remote\=.+/g, '');
            res.redirect(`/flussonic/${path}`)
        }
    });
}


app.get('/stream', (req, res) => {
    if (req.query.url) {
        if (req.query.url.includes('afghanlivetvchannels.com')) {
            afghanlivetvchannels_com(res, req.query.url);
        } else {
            res.send('Invalid URL');
        }
    } else {
        res.send('No URL');
    }
});

app.use('/flussonic', flussonic)

app.listen(4444, () => {
    console.log('Server is running on port 4444');
});