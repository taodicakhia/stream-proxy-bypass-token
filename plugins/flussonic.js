const express = require('express');
const request = require('request');
const router = express.Router();

async function m3u8Data(url, res) {
    request(url, (error, response, body) => {
        if (error) {
            res.status(500).send(error);
        } else if (response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/x-mpegURL');
            res.set('Connection', 'keep-alive');
            res.send(body);
        }
        else {
            res.status(response.statusCode).send(response.statusMessage);
        }
    })
}

async function streamData(url, res) {
    request(url).pipe(res);
}

router.get('/:domain/:id/index.m3u8', (req, res) => {
    const domain = req.params.domain; const id = req.params.id; const token = req.query.token;
    const url = `http://${domain}/${id}/index.m3u8?token=${token}`;
    m3u8Data(url, res);
})

router.get('/:domain/:id/:track/mono.m3u8', (req, res) => {
    const domain = req.params.domain; const id = req.params.id; const track = req.params.track; const token = req.query.token;
    const url = `http://${domain}/${id}/${track}/mono.m3u8?token=${token}`;
    m3u8Data(url, res);
})

router.get('/:domain/:id/:track/:y/:m/:d/:h/:mm/:file.ts', (req, res) => {
    const domain = req.params.domain; const id = req.params.id; const track = req.params.track; const y = req.params.y; const m = req.params.m; const d = req.params.d; const h = req.params.h; const mm = req.params.mm; const file = req.params.file; const token = req.query.token;
    const url = `http://${domain}/${id}/${track}/${y}/${m}/${d}/${h}/${mm}/${file}.ts?token=${token}`;
    streamData(url, res);
})

module.exports = router;