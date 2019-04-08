var ap = require('../audioprovider.js');

module.exports.run = (client, message, args) => {
  ap.showQueue(message.guild.id, message, client);
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'queue',
  category: 'Música',
  description: 'Mostra as informações da playlist.',
  endescription: 'Show the informations of the playlist.',
  usage: 'queue',
  enusage: 'queue'
};
