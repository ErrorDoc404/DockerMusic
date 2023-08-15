const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports = async (client, guild) => {

  try {
    const findGuildConfig = await GuildConfig.findOne({ guildId: guild.id });
    if (findGuildConfig) {
      console.log('Guild found');
    } else {
      try {
        const newGuildConfig = await GuildConfig.create({
          guildId: guild.id,
          prefix: '!',
        });
        console.log('New guild configuration created:', newGuildConfig);
      } catch (error) {
        console.error('Error creating guild configuration:', error);
      }
    }

  } catch (err) {
    console.log(err);
  }
};
