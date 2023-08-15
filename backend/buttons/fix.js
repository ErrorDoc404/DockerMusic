const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageEmbed, PermissionsBitField } = require("discord.js");

module.exports = {
  name: 'fix',
  run: async (client, interaction, parms, { MusicDB }) => {
    const language = require(`../language/${MusicDB.language}.js`);
    let player = await client.manager.get(interaction.guildId);
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: `You dont have permission to do that` }).catch(err => { client.error(err) });
    if (player) {
      client.guildQueue[player.guild] = 0;
      if (!client.twentyFourSeven[player.guild])
        player.destroy();
      else {
        player.queue.clear();
        player.stop();
      }
    }

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

    const embed = {
      title: `${language.songTitle}`,
      description: `${language.songDesc}(https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
      color: 0xd43790,
      image: {
        url: 'https://cdn.dribbble.com/users/1008970/screenshots/6140230/blog_post_docker.gif',
      },
      thumbnail: {
        url: '',
      },
      footer: {
        text: `${client.user.username} Music`,
        iconURL: `${client.user.avatarURL()}`,
      },
    };
    client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
    client.musicMessage[interaction.guildId].edit({ content: `${language.title}\n${language.description}`, embeds: [embed], components: [row] });
    return interaction.reply({ content: `fixed` }).catch(err => { client.error(err) });
  }
}