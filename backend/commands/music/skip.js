module.exports = {
    name: 'skip',
    description: 'Skip the current song',
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    premium: true,
    SlashCommand: {
        run: async (client, interaction) => {
            const guild = client.guilds.cache.get(interaction.guildId);
            const member = guild.members.cache.get(interaction.member.user.id);
            let player = await client.manager.get(interaction.guildId);
            if (!player) return interaction.reply({ content: `❌ | **Nothing in queue to skip**` }).catch(err => { client.error(err) });
            let song = player.queue.current;
            if (member.user === song.requester) {
                if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
                player.stop();
                client.skipSong[interaction.guildId] = true;
                client.skipBy[interaction.guildId] = member.user;
                return interaction.reply({ content: `✅ | **You skip this song.**` }).catch(err => { client.error(err) });
            }
            else return interaction.reply({ content: `❌ | **You can't skip this song**` }).catch(err => { client.error(err) });
        }
    }
};