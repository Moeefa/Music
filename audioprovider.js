const ytdl = require('ytdl-core');
const getYouTubeID = require('get-youtube-id');
const request = require('request');
const ytpl = require('ytpl');
const { RichEmbed } = require('discord.js');
var g = {};

const yt_api_key = process.env.KEYYT

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(yt_api_key);

exports.addQueue = async (client, message, searchString) => {
  if (!g[message.guild.id]) g[message.guild.id] = {
    playQueue: [],
    dispatcher: null,
    nowPlaying: null,
    skipReq: 0,
    skippers: [],
    loop: false
  };
  
  if (searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const embedA = new RichEmbed()
    .setColor('RANDOM')
    .setDescription(`Adicionando a playlist!`)
    var msg = await message.channel.send(embedA)
      
    const playlist = await youtube.getPlaylist(searchString);
		const videos = await playlist.getVideos();
    var ran = 0
		for (var video of Object.values(videos)) {
			let info = await ytdl.getInfo(video.id);
      
      let hour = (info.length_seconds / 3.6e+6).toString();
      let min = (~~(info.length_seconds / 60)).toString();
      let sec = (~~(info.length_seconds % 60)).toString();
  
      hour = hour.slice(0, hour.lastIndexOf('.'))
  
      sec.length == 1 ? sec = '0' + sec : sec = sec;
      min.length == 1 ? min = '0' + min : min = min;
      hour.length == 1 ? hour = '0' + hour : hour = hour;
            
      var song = {
        title: info.title,
        id: info.video_id,
        length: `${hour}:${min}:${sec}`
      };
      g[message.guild.id].playQueue.push(song);
      
      if (ran == 0) {
        const embed = new RichEmbed()
        .setColor('RANDOM')
        .setURL(`https://www.youtube.com/watch?v=${song.id}`);
        (g[message.guild.id].nowPlaying !== null) ? embed.setDescription(`Adicionado à fila: [${song.title}](https://www.youtube.com/watch?v=${song.id}).`) : embed.setDescription(`📼 Tocando agora: [${song.title}](https://www.youtube.com/watch?v=${song.id}).`);
        msg.delete();
        await message.channel.send(embed);
      }
      
      if (!message.guild.voiceConnection || g[message.guild.id].nowPlaying == null && ran == 0) {
        message.member.voiceChannel.join().then(connection => {
          playSong(connection, message.guild.id);
        });
      };
      
      ran = 1
		};
    
    return;
  };
  
  getID(client, message, searchString, async function(id) {
    let info = await ytdl.getInfo(id);
    
    let hour = (info.length_seconds / 3.6e+6).toString();
    let min = (~~(info.length_seconds / 60)).toString();
    let sec = (~~(info.length_seconds % 60)).toString();
  
    hour = hour.slice(0, hour.lastIndexOf('.'))
  
    sec.length == 1 ? sec = '0' + sec : sec = sec;
    min.length == 1 ? min = '0' + min : min = min;
    hour.length == 1 ? hour = '0' + hour : hour = hour;
  
    var song = {
      title: info.title,
      id: info.video_id,
      length: `${hour}:${min}:${sec}`
    };

    const embed = new RichEmbed()
    .setColor('RANDOM')
    .setURL(`https://www.youtube.com/watch?v=${song.id}`);
    (g[message.guild.id].nowPlaying !== null) ? embed.setDescription(`Adicionado à fila: [${song.title}](https://www.youtube.com/watch?v=${song.id}).`) : embed.setDescription(`📼 Tocando agora: [${song.title}](https://www.youtube.com/watch?v=${song.id}).`);
    await message.channel.send(embed);
  
    g[message.guild.id].playQueue.push(song);
  
    if (!message.guild.voiceConnection || g[message.guild.id].nowPlaying == null) {
      message.member.voiceChannel.join().then(connection => {
        playSong(connection, message.guild.id);
      });
    };
  });
};

exports.resumeSong = (guildId, message, client) => {
    if (!g[guildId]) return client.embed(message.channel, `Não há nada tocando!`);
    if (!g[guildId].dispatcher) return client.embed(message.channel, `Não há nada tocando!`);
    g[guildId].dispatcher.resume();
    client.embed(message.channel, `Resumido! ▶`)
};

exports.skipSong = (guildId, message, client) => {
    if(!g[guildId]) return message.reply(`Não há nada tocando!`);
    if (!g[guildId].dispatcher) return client.embed(message.channel, `Não há nada tocando!`);
  
    if (g[guildId].skippers.indexOf(message.author.id) === -1) {
    
      g[guildId].skipReq = Math.ceil(message.guild.me.voiceChannel.members.size-2)
      g[guildId].skippers.push(message.author.id)
      
      if (g[guildId].skippers.length >= g[guildId].skipReq) {
        g[guildId].skippers = [];
        g[guildId].skipReq = 0;
      
        g[guildId].dispatcher.end();
        client.embed(message.channel, `Pulando! 🐇`);
      } else {
        client.embed(message.channel, `Falta(m) ${g[guildId].skipReq - g[guildId].skippers.length} voto(s) para pular a música!`);
      }
    } else {
      client.embed(message.channel, `Você já votou para pular! Mais ${g[guildId].skipReq - g[guildId].skippers.length} voto(s) para pular!`)
    }
};

exports.pauseSong = (guildId, message, client) => {
    if (!g[guildId]) return client.embed(message.channel, `Não há nada tocando!`);
    if (!g[guildId].dispatcher) return client.embed(message.channel, `Não há nada tocando!`);
    
    g[guildId].dispatcher.pause();
    
    client.embed(message.channel, `Pausei a música! ⏸`)
};

exports.stopSong = (guildID, message, client) => {
  if (!g[guildID]) return client.embed(message.channel, `Não há nada tocando!`);
  if (!g[guildID].dispatcher) return client.embed(message.channel, `Não há nada tocando!`);
  g[guildID].playQueue = [];
  g[guildID].dispatcher.end();
  delete g[guildID];
  client.embed(message.channel, `Parei as músicas!`)
};

exports.showQueue = (guildID, message, client) => {
  if (!g[guildID] || !g[guildID].nowPlaying) return client.embed(message.channel, `Não há nada tocando!`);

  var q = "";
  var i = 1;
  let ytBaseUrl = "https://www.youtube.com/watch?v=";
  if (g[guildID].playQueue.length > 0) {
    g[guildID].playQueue.forEach(song => {
      let ytLink = ytBaseUrl + song.id;
      let title = song.title;
      if (title.length > 60) title = title.substring(0, 55) + "... ";
      
      q += "`" + i++ + "`. ";
      q += `[${title}](${ytLink}) | `;
      q += "`" + song.length + "`\n";
    });
  }

  let currSong = g[guildID].nowPlaying.title;
  if (currSong.length > 60) currSong = currSong.substring(0, 55) + "... ";
  
  let sec = (~~(g[guildID].dispatcher.time / 1000 % 60)).toString();
  let min = (~~(g[guildID].dispatcher.time / 1000 / 60)).toString();
  let hour = (g[guildID].dispatcher.time / 3.6e+6).toString();
  
  hour = hour.slice(0, hour.lastIndexOf('.'))
  
  sec.length == 1 ? sec = '0' + sec : sec = sec;
  min.length == 1 ? min = '0' + min : min = min;
  hour.length == 1 ? hour = '0' + hour : hour = hour;
  
  var cs = `[${currSong}](${ytBaseUrl + g[guildID].nowPlaying.id}) | `;
  cs += `\`${hour}:${min}:${sec}/${g[guildID].nowPlaying.length}\``;

  const embed = new RichEmbed()
  .setColor(`RANDOM`)
  .addField(`Tocando agora:`, cs);
  
  if (g[guildID].loop) embed.setFooter(`Playlist em loop! 🔁`);
  
  if (q.length < 1021) {
    if (q != "") embed.addField(`Próximas músicas:`, q);
  } else {
    let text = q.slice(0, 1024);
    let stop = text.lastIndexOf('\n')
    if (q != "") embed.addField(`Próximas músicas:`, q.slice(0, stop) + '...');
  }

  message.channel.send(embed);
};

exports.toggleLoop = (guildId, message, client) => {
  if (!g[guildId]) return client.embed(message.channel, `Não há nada tocando!`);
  if (!g[guildId].nowPlaying) return client.embed(message.channel, `Não há nada tocando!`);
  
  if (!g[guildId].loop) {
    client.embed(message.channel, `🔁 Looping playlist!`);
    g[guildId].loop = true;
  } else {
    client.embed(message.channel, `🔀 Desativei o loop!`);
    g[guildId].loop = false;
  }
};

async function playSong(connection, guildID) {  
  g[guildID].dispatcher = await connection.playStream(ytdl("https://www.youtube.com/watch?v=" + g[guildID].playQueue[0].id, {filter: "audioonly"}), {passes: 5});
  g[guildID].nowPlaying = g[guildID].playQueue[0];
  g[guildID].playQueue.shift();
  
  g[guildID].dispatcher.on("end", () => {
    if (g[guildID].loop) {
      g[guildID].playQueue.push(g[guildID].nowPlaying);
      return;
    }
    if (g[guildID].playQueue.length > 0) {
      playSong(connection, guildID);
    } else {
      delete g[guildID];
      connection.disconnect();
    }
  });
};

function getID(client, message, str, cb) {
    if (isYoutube(str)) {
        cb(getYouTubeID(str));
    } else {
        search_video(client, message, str, function(id) {
            cb(id);
        });
    }
}
 
function search_video(client, message, query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);
        if (!json.items[0]) client.embed(message.channel, `Não encontrei nenhum vídeo com esses argumentos!`)
        else {
          callback(json.items[0].id.videoId);
        }
    });
}
 
function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}