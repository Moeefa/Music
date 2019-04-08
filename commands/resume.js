const ap = require('../audioprovider.js')

module.exports.run = (client, message, args) => {
  ap.resumeSong(message.guild.id, message, client)
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'resume',
  category: 'Música',
  description: 'Resume a playlist.',
  endescription: 'Resume the playlist.',
  usage: 'resume',
  enusage: 'resume'
};
