const ap = require('../audioprovider.js');

module.exports.run = (client, message, args) => {
  ap.pauseSong(message.guild.id, message, client)
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'pause',
  category: 'Música',
  description: 'Pause a playlist.',
  endescription: 'Pause the playlist.',
  usage: 'pause',
  enusage: 'pause'
};
