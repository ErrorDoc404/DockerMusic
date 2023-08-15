const { Server } = require("socket.io");
const botName = 'LavaCod';

const prettyMilliseconds = require("pretty-ms");

/**
 * @param {Server} io
 */

module.exports = (io) => {
  io.on("connection", (socket) => {
    //Bot's Main Page
    socket.on("index", () => {
      if (socket.Index) clearInterval(socket.Index);
      socket.Index = setInterval(() => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        Client.InQueue = 0;
        for (var key in Client.guildQueue) {
          Client.InQueue = Client.InQueue + Client.guildQueue[key];
        }
        socket.emit("index", {
          commands: Client.CommandsRan,
          playMusic: Client.MusicPlayed,
          inQueue: Client.InQueue,
          guilds: Client.guilds.cache.size,
          ping: Client.ws.ping,
        });
      }, 1000);
    });

    socket.on("server", (ServerID) => {
      if (socket.Server) clearInterval(socket.Server);
      socket.Server = setInterval(async () => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        let Guild = Client.guilds.cache.get(ServerID);
        if (!Guild) return socket.emit("error", "Unable to find that server");
        let GuildDB = await Client.GetMusic(Guild.id);
        let player = Client.manager.get(Guild.id);
        if (!player) {
          socket.emit("server", {
            serverName: Guild.name,
            queue: 0,
            songsLoop: "Disabled",
            queueLoop: "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
          });
        } else {
          socket.emit("server", {
            serverName: Guild.name,
            queue: player.queue ? player.queue.length : 0,
            queueList: player.queue.slice(0, 10),
            songsLoop: player.trackRepeat ? "Enabled" : "Disabled",
            queueLoop: player.queueRepeat ? "Enabled" : "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
            maxDuration: player.queue.current
              ? prettyMilliseconds(player.queue.current.duration, {
                colonNotation: true,
              })
              : false,
            position: player.queue.current
              ? prettyMilliseconds(player.position, { colonNotation: true })
              : false,
            nowPlaying: player.queue.current ? player.queue.current : false,
          });
        }
      }, 1000);
    });

  });
};
