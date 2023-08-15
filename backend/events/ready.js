const { Collection } = require('discord.js');
const BotStats = require("../mongoose/database/schemas/Stats");

/**
 * @param {import("../library/MusicBot")} client
 */
module.exports = async (client) => {
  client.Ready = true;
  client.user.setPresence(client.config.presence);
  client.log("Successfully logged in as " + client.user.tag);
  client.manager.init(client.user.id);
  // await client.DeRegisterGlobalSlashCommands();
  // await client.DeRegisterGuildSlashCommands();
  await client.RegisterSlashCommands();

  try {
    const allStats = await BotStats.find();

    allStats.forEach((stats) => {
      client.MusicPlayed += stats.songsCounter;
      client.CommandsRan += stats.commandsCounter;
    });

    console.log('Total Songs:', client.MusicPlayed);
    console.log('Total Commands:', client.CommandsRan);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }


  client.guilds.cache.forEach((guild) => {
    client.skipSong[guild.id] = false;
    client.skipBy[guild.id] = false;
    client.twentyFourSeven[guild.id] = false;
  });
};
