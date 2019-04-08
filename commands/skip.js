var ap = require('../audioprovider.js');

module.exports.run = (client, message, args) => {
  ap.skipSong(message.guild.id, message, client);
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'skip',
  category: 'Música',
  description: 'Pula a música da playlist.',
  endescription: 'Skip the song of playlist.',
  usage: 'skip',
  enusage: 'skip'
};
