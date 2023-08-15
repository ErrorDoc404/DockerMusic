module.exports = async (client, member) => {
    // // To compare, we need to load the current invite list.
    // const newInvites = await member.guild.invites.fetch()
    // // This is the *existing* invites for the guild.
    // const oldInvites = client.invites.get(member.guild.id);
    // // Look through the invites, find the one for which the uses went up.
    // const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
    // // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    // console.log(invite.inviter);
    // const inviter = await client.users.fetch(invite.inviter.id);
    // // Get the log channel (change to your liking)
    // const logChannel = member.guild.channels.cache.find(channel => channel.name === "logs");
    // // A real basic message with the information we need. 
    // inviter
    //     ? console.log(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`)
    //     : console.log(`${member.user.tag} joined but I couldn't find through which invite.`);
};
