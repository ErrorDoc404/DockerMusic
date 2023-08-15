const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'skip',
  run: async (client, interaction, parms, {MusicDB}) => {
    const language = require(`../language/${MusicDB.language}.js`);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    let player = await client.manager.get(interaction.guildId);
    if (!player) return interaction.reply({ content: `${language.nothingInQueue}` }).catch(err => { client.error(err) });
    let song = player.queue.current;
    if (member.user === song.requester) {
      if (!member.voice.channel) return interaction.reply({ content: `${language.notInVoiceChannel}`}).catch(err => { client.error(err) });
      player.stop();
      client.skipSong[interaction.guildId] = true;
      client.skipBy[interaction.guildId] = member.user;
      return interaction.reply({ content: `${language.skipSuccess}` }).catch(err => { client.error(err) });
    }
    else return interaction.reply({ content: `${language.skipNotAllowed}` }).catch(err => { client.error(err) });
  }
}
