const { PermissionsBitField } = require("discord.js");
const GenerateToken = require('generate-serial-key');
const Redeem = require("../../mongoose/database/schemas/Redeem");

module.exports = {
    name: "token",
    description: "porvide token to user",
    usage: "[owner]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "settings",
    SlashCommand: {
        options: [
            {
                name: "user",
                description: "Select user to provide Redeem Code",
                value: "user",
                type: 6,
                required: true,
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { MusicDB }) => {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply(`you dont have manage guild permission to run this command`).catch(err => { client.error(err) });
            const user = args.user;
            if (!interaction.user.id == '456130838183280651' || !interaction.user.id == '963655683658629150')
                return interaction.reply('You dont have permission to authorize tokens');

            var tempToken = GenerateToken.generate(28, '-', 4);

            const newRedeem = await Redeem.create({
                userId: user.id,
                token: tempToken,
            });

            return interaction.reply(`Token is provided to ${user.username}`).catch(err => { client.error(err) });
        },
    },
};
