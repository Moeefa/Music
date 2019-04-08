var ap = require('../audioprovider.js');

module.exports.run = async (client, message, args) => {
  if (!args[0]) return client.embed(message.channel, "Especifique uma música!");

  if (!message.member.voiceChannel) return client.embed(message.channel, "Você precisa estar em um canal de voz!");

  var botUserId = client.user.id;
  if (!message.member.voiceChannel.members.get(botUserId) && !message.member.voiceChannel.joinable) return client.embed(message.channel, "Não tenho permissão para entrar no canal de voz!");

  const searchString = message.content.split(" ").slice(1).join(" ");
  ap.addQueue(client, message, searchString)
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'play',
  category: 'Música',
  description: 'Toca músicas!',
  endescription: 'Play musics!',
  usage: 'play [Pesquisa/Link]',
  enusage: 'play [Search/Link]'
};
