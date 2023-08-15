const { PermissionsBitField } = require("discord.js");
const client = require("../../");
const api = require("express").Router();

/**
 * Get user information and check guild permissions
 */
api.get("/", async (req, res) => {
    try {
        if (!req.user) {
            // Return empty object if there is no authenticated user
            return res.send({});
        }

        // Update guild information for the user
        req.user.guilds.map((guild) => {
            guild.hasPerms = new PermissionsBitField(BigInt(guild.permissions)).has(
                PermissionsBitField.Flags.ManageGuild,
                true
            );
            guild.inGuild = client.guilds.cache.has(guild.id);
            guild.client_id = client.user;
            return guild;
        });

        // Send user information as response
        res.send({ user: req.user });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

/**
 * Get guild cache information
 */
api.get('/guild/cache', async (req, res) => {
    try {
        // Send guild cache information as response
        res.send(client.guilds.cache);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;