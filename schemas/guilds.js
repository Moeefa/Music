const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
  guildID: String,
  prefix: String,
  lang: String
});

module.exports = mongoose.model("Guilds", guildSchema)
