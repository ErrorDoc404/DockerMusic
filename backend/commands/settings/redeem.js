const Redeem = require("../../mongoose/database/schemas/Redeem");
const Premium = require("../../mongoose/database/schemas/Premium");

module.exports = {
    name: "redeem",
    description: "Make your bot premium",
    usage: "[token]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "settings",
    SlashCommand: {
        options: [
            {
                name: "token",
                description: "Need Redeem Code",
                value: "token",
                type: 3,
                required: true,
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { MusicDB }) => {
            const token = args.value;

            const data = await Redeem.findOne({ token: token });

            const premium = await Premium.findOne({ guildId: interaction.guild.id });

            if (premium)
                if (premium.time > Date.now())
                    return interaction.reply(`Premirm is already activaded \nApply after:  **${premium.time}**`).catch(err => { client.error(err) });

            if (data && !data.guildId) {
                const updateRedeem = await Redeem.findOneAndUpdate({ token: token }, {
                    used: true,
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                });
                var premiumTime = Date.now() + (60000 * 60 * 24 * 30);

                if (premium) {
                    await Premium.findOneAndUpdate({ guildId: interaction.guild.id }, {
                        token: token,
                        time: premiumTime,
                        expire: false
                    });
                } else {
                    await Premium.create({
                        guildId: interaction.guild.id,
                        token: token,
                        time: premiumTime
                    });
                }
            }
            else
                return interaction.reply(`Invalid Token : ${token}`).catch(err => { client.error(err) });

            return interaction.reply(`Token has been redeem : ${token}`).catch(err => { client.error(err) });
        },
    },
};
