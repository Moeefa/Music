module.exports = async (a, b) => {
  const c = require("../schemas/guilds.js");
  let d;
  if (b.guild ? await c.findOne({
      guildID: b.guild.id
    }, (a, b) => {
      d = b && b.prefix ? b.prefix : "h!!"
    }) : d = "h!!", b.author.bot) return;
  const e = a.config.defaultSettings;
  if (0 !== b.content.indexOf(d)) return;
  const f = b.content.slice(d.length).trim().split(/ +/g),
    g = f.shift().toLowerCase(),
    h = a.permlevel(b),
    i = a.commands.get(g) || a.commands.get(a.aliases.get(g));
  if (!i) return;
  if (i && !b.guild && i.conf.guildOnly) return a.embed(b.channel, "Esse comando est\xE1 indispon\xEDvel nas MDs. Execute este comando em um servidor.");
  if (h < a.levelCache[i.conf.permLevel]) return "true" === e.systemNotice ? a.embed(b.channel, `<@${b.author.id}> Você não tem permissão para usar este comando.`) : void 0;
  b.author.permLevel = h, b.flags = [], i.run(a, b, f, h);
  let j = a.channels.get("431588922221527042"),
    k = `Usuário(a): ${b.author.tag}\nID do(a) usuário(a): ${b.author.id}\nNível de permissão: ${h}\nComando usado: ${i.help.name}`;
  b.guild && (k += `\nServidor: ${b.guild.name}\nCanal: ${b.channel.name}`), a.embed(j, `${k}`), console.log(`\n${k}\n`)
};