const Discord = require('discord.js'),
      client = new Discord.Client(),
      fs = require('fs'),
      { promisify } = require("util"),
      readdir = promisify(require("fs").readdir),
      Enmap = require("enmap"),
      express = require('express'),
      app = express(),
      moment = require('moment');

moment.locale('pt-BR');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true
});

app.listen(process.env.PORT);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200)
});

client.config = require("./config.js");
require("./modules/functions.js")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

/*
===================
X      START      X
X       BOT       X
X    FUNCTION     X
===================
*/

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("Não achei nenhum comando.");
    return;
  }

  console.log(`Carregando ${jsfile.length} comandos no total.`)
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`Carregando o comando: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
  
  client.levelCache = {};
  for (let a = 0; a < client.config.permLevels.length; a++) {
    const b = client.config.permLevels[a];
    client.levelCache[b.name] = b.level;
  };
});

 const Guild = require("./schemas/guilds.js");

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  
  let content = message.content.split(" ");
  let command = content[0];
  let args = content.slice(1);
  let prefix = 'k!!'
  if (message.guild ? await Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
    prefix = guild && guild.prefix ? guild.prefix : "k!!";
  }) : prefix = "k!!", message.author.bot) return;
  
  if (0 !== message.content.indexOf(prefix)) return;
  
  let cmd = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
  if (cmd) {
    if (!message.guild && cmd.conf.guildOnly) return client.embed(message.channel, "Esse comando está indisponível nas MDs. Execute este comando em um servidor.");
    const conf = client.config.defaultSettings;
    if (client.permlevel(message) < client.levelCache[cmd.conf.permLevel]) return "true" === conf.systemNotice ? client.embed(message.channel, `<@${message.author.id}> Você não tem permissão para usar este comando.`) : void 0;
    cmd.run(client, message, args);
    let j = client.channels.get("431588922221527042"),
      k = `Usuário(a): ${message.author.tag}\nID do(a) usuário(a): ${message.author.id}\nNível de permissão: ${client.permlevel(message)}\nComando usado: ${cmd.help.name}`;
    message.guild && (k += `\nServidor: ${message.guild.name}\nCanal: ${message.channel.name}`), client.embed(j, `${k}`), console.log(`\n${k}\n`);
  };
});

client.on("ready", () => {
  var texto = ['Se o Bob Esponja é o protagonista, por que o Patrick é a estrela? 🤔', 'Se você está lendo isso, você sabe ler! 😂', 'Eu sou uma foca aqui ó! 🍫🛁', 'Saving people, hunting things. The family business. 👻', 'Você não pode ver sua própria sombra no CS:GO. 😐', 'Cuidado não vomitar ou até mesmo desmaiar ao ir no Slinger Shot! 🤢', 'As horas passam rápido quando você etá fazendo algo legal. 🕐🕔🕙', 'Bichos pequenos são mais perigosos do que você pensa! Mas há um bicho grande bem perigoso, os humanos! 🦂'];
  const random = texto[Math.floor(Math.random() * texto.length)];
  console.log(`%s | %s`, moment().format("MMM Do YY"), random);
});

client.login(process.env.DISCORD_TOKEN);