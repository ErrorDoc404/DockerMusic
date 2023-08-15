const { EmbedBuilder } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: '247',
    description: 'Sets 24/7 mode, bot stays in voice channel 24/7.',
    usage: "",
    permissions: {
        channel: ["MANAGE_CHANNELS"],
        member: [],
    },
    aliases: [],
    category: "music",
    premium: true,
    SlashCommand: {
        run: async (client, interaction, args, { MusicDB }) => {
            await interaction.deferReply({
                ephemeral: false,
            });

            if (MusicDB.twentyFourSeven) {
                MusicDB.twentyFourSeven = false;
                const embed = new EmbedBuilder()
                    .setDescription("24/7 mode is **disabled**.")
                    .setColor(0xFF0000);
                await interaction.editReply({ embeds: [embed] }).catch(console.error);
            } else {
                MusicDB.twentyFourSeven = true;
                const embed = new EmbedBuilder()
                    .setDescription("24/7 mode is **enabled**.")
                    .setColor(0x00FF00);
                await interaction.editReply({ embeds: [embed] }).catch(console.error);
            }

            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guildId },
                { twentyFourSeven: MusicDB.twentyFourSeven }
            );

            return;
        },
    },
};
