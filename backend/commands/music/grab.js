const SaveMusic = require("../../mongoose/database/schemas/SaveMusic");

module.exports = {
    name: 'grab',
    description: 'Save your current Song',
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    premium: true,
    SlashCommand: {
        run: async (client, interaction, args, { MusicDB }) => {
            let channel = interaction.channel;
            if (!channel) return;

            let player;
            if (client.manager) player = await client.manager.get(interaction.guildId);
            else return interaction.reply({ content: `Lavalink node is not connected` }).catch(err => { client.error(err) });


            if (!player) return interaction.reply({ content: `There are no songs in the queue.` }).catch(err => { client.error(err) });

            const data = await SaveMusic.findOne({ userId: interaction.user.id, trackId: player.queue.current.identifier });

            if (data) return interaction.reply({ content: `Current Music is already save.` }).catch(err => { client.error(err) });

            else {
                await SaveMusic.create({
                    userId: interaction.user.id,
                    trackId: player.queue.current.identifier,
                    track: player.queue.current
                });

                return interaction.reply({ content: `Current Music is save to your List.` }).catch(err => { client.error(err) });
            }
        }
    }
};