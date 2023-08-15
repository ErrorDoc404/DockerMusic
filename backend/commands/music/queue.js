const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "queue",
    description: "Display the current music queue",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: [],
    category: "music",
    premium: true,
    SlashCommand: {
        run: async (client, interaction) => {
            // Get the guild ID
            const guildId = interaction.guildId;

            // Get the music queue for the guild
            let player = await client.manager.get(interaction.guildId);
            if (!player) return interaction.reply({ content: `❌ | **Nothing in queue**` }).catch(err => { client.error(err) });

            if (!player.queue || !player.queue.length || player.queue.length === 0) {
                return interaction.reply({ content: "❌ | **Invalid, Not enough track to be showned.**", ephemeral: true }).catch(err => { client.error(err) });
            }

            let queue = player.queue;

            if (!Array.isArray(queue) || queue.length === 0) {
                await interaction.reply("The music queue is currently empty.");
                return;
            }

            const nextTracks = queue.slice(0, 10);

            const embed = new EmbedBuilder()
                .setTitle("Music Queue")
                .setDescription(nextTracks.map((track, index) => `${index + 1}. ${track.title}`).join("\n"))
                .setColor(0x00FF00);

            // Rest of your code...

            // Send the embed as the reply
            await interaction.reply({ embeds: [embed] });
        }
    }
};