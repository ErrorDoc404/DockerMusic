const client = require("../../");
const api = require("express").Router();
const Redeem = require("../../mongoose/database/schemas/Redeem");

/**
 * Get redemption data for the authenticated user
 */
api.get('/', async (req, res) => {
    try {
        if (req.user) {
            // Find redemption data based on the user's Discord ID
            const data = await Redeem.find({ userId: req.user.discordId });

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