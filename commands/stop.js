var ap = require('../audioprovider.js');

module.exports.run = (client, message, args) => {
  ap.stopSong(message.guild.id, message, client);
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'stop',
  category: 'Música',
  description: 'Para a playlist.',
  endescription: 'Stop the playlist.',
  usage: 'stop',
  enusage: 'stop'
};
