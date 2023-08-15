const client = require("../..");
const SaveMusic = require("../../mongoose/database/schemas/SaveMusic");
const Auth = require("../Middlewares/Auth");
const api = require("express").Router();

/**
 * Get saved music for the authenticated user
 */
api.get('/save', Auth, async (req, res) => {
    try {
        if (req.user) {
            // Find saved music based on the user's Discord ID
            const data = await SaveMusic.find({ userId: req.user.discordId });

            if (data) {
                return res.send(data);
            } else {
                return res.send(false);
            }
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;