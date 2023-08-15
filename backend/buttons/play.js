const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: 'play',
  run: async (client, interaction, parms, {MusicDB}) => {
    const language = require(`../language/${MusicDB.language}.js`);
    const player = await client.manager.get(interaction.guildId);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!player) return interaction.reply({ content: `❌ | **Nothing in Queue to play right now...**` }).catch(err => { client.error(err) });
    if (!member.voice.channel) return interaction.reply({ content: `❌ | **You must be in a voice channel to use this Button!**` }).catch(err => { client.error(err) });
    if (guild.members.me.voice.channel && !guild.members.me.voice.channel.equals(member.voice.channel)) return interaction.reply({ content: `❌ | **You must be in the same voice channel as me to use this Button!**` }).catch(err => { client.error(err) });
    if (player.playing) return interaction.reply({ content: `❌ | **Music is already playing!**` }).catch(err => { client.error(err) });
    player.pause(false);
    if (!player.voiceState) player.connect();

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('pause')
        .setLabel(`${language.buttonPause}`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel(`${language.buttonSkip}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('clear')
        .setLabel(`${language.buttonClear}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel(`${language.buttonStop}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('fix')
        .setLabel(`${language.buttonRepair}`)
        .setStyle(ButtonStyle.Secondary),
    ]);

    client.musicMessage[interaction.guildId].edit({ components: [row] });
    return interaction.reply({ content: `${language.resumeSuccess}` }).catch(err => { client.error(err) });
  }
}
