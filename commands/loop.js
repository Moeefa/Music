var ap = require('../audioprovider.js');

module.exports.run = (client, message, args) => {
  ap.toggleLoop(message.guild.id, message, client);
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['repeat'],
  permLevel: 'User'
};

module.exports.help = {
  name: 'loop',
  category: 'Música',
  description: 'Coloca a playlist em loop.',
  endescription: 'Set loop in playlist.',
  usage: 'loop',
  enusage: 'loop'
};
