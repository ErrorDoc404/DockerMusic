const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "autoplay",
    description: "Toggle autoplay mode for music.",
    usage: "",
    permissions: {
        channel: ["MANAGE_CHANNELS"],
        member: [],
    },
    aliases: [],
    category: "music",
    premium: true,
    SlashCommand: {
        run: async (client, interaction, args) => {
            const player = client.music.players.get(interaction.guild.id);

            if (!player) {
                const embed = new MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("No player is available in this guild.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            player.set("autoplay", !player.get("autoplay"));

            const embed = new MessageEmbed()
                .setColor(player.get("autoplay") ? "#00FF00" : "#FF0000")
                .setDescription(`Autoplay mode is now ${player.get("autoplay") ? "enabled" : "disabled"}.`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
}
