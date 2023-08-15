const client = require("../../");
const api = require("express").Router();

api.get('/', async (req, res) => {
    try {
        if (req.user) {
            return res.send(req.user);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

api.get('/guilds', async (req, res) => {
    try {
        if (req.user) {
            return res.send(req.user.guilds);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


module.exports = api;