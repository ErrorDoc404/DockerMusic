const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports = {
  name: "play",
  description: "play music",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  category: "inbuild",
  run: async (client, message, { MusicDB }) => {
    // Check if the user is in a voice channel
    if (!message.member.voice.channel) return message.channel.send(`❌ | **You must be in a voice channel to play something!**`);

    let searchString = message.content;
    let checkNode = client.manager.nodes.get(client.config.lavalink[0].host);

    // Check if the Lavalink node is connected
    if (!checkNode || !checkNode.connected) return message.channel.send(`❌ | **Lavalink node not connected**`);

    // Fetch the music message from the database
    client.musicMessage[message.guild.id] = await message.channel.messages.fetch(MusicDB.musicMessageId);

    const GuildData = await GuildConfig.findOne({ guildId: message.guild.id });
    client.twentyFourSeven[message.guild.id] = GuildData.twentyFourSeven;

    let player = client.manager.get(message.guild.id);

    if (player && (!player.playing && player.voiceChannel !== message.member.voice.channel.id)) {
      // If bot is not playing and voice channel is different, destroy the player and create a new one
      await player.destroy();
      player = undefined;
      await delay(1000);
    }

    if (!player || (!player.playing && player.voiceChannel === message.member.voice.channel.id)) {
      // If player is undefined or not playing and voice channel is the same, create a new player
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });
    }

    if (!player) return message.channel.send(`❌ | **Nothing is playing right now...**`);
    if (player.playing && player.voiceChannel !== message.member.voice.channel.id) return message.channel.send(`❌ | **You must be in the same voice channel as me to play something!**`);

    try {
      if (player.state !== "CONNECTED") await player.connect();

      let searched = await client.manager.search(searchString, message.author);

      if (searched.loadType === "NO_MATCHES") return message.channel.send(`**No matches found for -** ${searchString}`);
      else if (searched.loadType === "PLAYLIST_LOADED") {
        player.queue.add(searched.tracks);
        if (!player.playing && !player.paused && player.queue.totalSize === searched.tracks.length) player.play();
      } else {
        player.queue.add(searched.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.size) player.play();
      }

      if (player.queue.length >= 1) client.guildQueue[message.guild.id] = player.queue.length;

      if (player.queue.length === 1) {
        content = `**[ Now Playing ]**\n${player.queue.current.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
        client.musicMessage[message.guild.id].edit({ content: content });
      } else if (player.queue.length > 1) {
        content = client.musicMessage[message.guild.id].content.replace(`${player.queue.length - 1} Songs in Queue`, `${player.queue.length} Songs in Queue`);
        client.musicMessage[message.guild.id].edit({ content: content });
      }
    } catch (e) {
      message.channel.send(`**No matches found for -** ${searchString} with ${e}`);
    }
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}