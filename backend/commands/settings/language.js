const { PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "language",
    description: "Update the bot's language for your server",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "settings",
    premium: true,
    SlashCommand: {
        options: [
            {
                name: "language",
                description: "Select the language for the bot",
                type: 3, // String type
                required: true,
                choices: [
                    // { name: "Assamese", value: "assamese" },
                    // { name: "Bengali", value: "bengali" },
                    { name: "English", value: "english" },
                    // { name: "Gujarati", value: "gujarati" },
                    // { name: "Hindi", value: "hindi" },
                    // { name: "Japanese", value: "japanese" },
                    // { name: "Kannada", value: "kannada" },
                    // { name: "Korean", value: "korean" },
                    // { name: "Maithili", value: "maithili" },
                    // { name: "Malayalam", value: "malayalam" },
                    // { name: "Manipuri", value: "manipuri" },
                    // { name: "Marathi", value: "marathi" },
                    // { name: "Mizoram", value: "mizoram" },
                    // { name: "Odisha", value: "odisha" },
                    // { name: "Punjabi", value: "punjabi" },
                    // { name: "Tamil", value: "tamil" },
                    // { name: "Telugu", value: "telugu" }
                ],
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Interaction} interaction
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { MusicDB }) => {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return interaction.reply("You don't have the 'Manage Guild' permission to run this command.")
                    .catch((err) => client.error(err));

            const language = args.value;
            const guildId = interaction.guildId;

            // Update the language setting in GuildConfig
            await GuildConfig.findOneAndUpdate({ guildId }, { language });

            return interaction.reply(`Language set to ${language}`).catch(err => { client.error(err) });
        },
    },
};