/**
 *
 * @param {import("../library/MusicBot ")} client
 */
module.exports = async (client, data) => {
  client.manager.updateVoiceState(data);
};
