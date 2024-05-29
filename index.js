const Discord = require("discord.js")
const sqlite3 = require('sqlite3')
const config = require("./config/config.json")
const fs = require("fs")

const client = new Discord.Client({
    intents:[
        Discord.GatewayIntentBits.Guilds
    ]
})

client.on("ready",()=>{
    console.log(`Status: ON`)
    client.user.setActivity({
        name: 'customstatus',
        type: Discord.ActivityType.Custom,
        state: "🛠️ Manutenção por @cyberdarkbr 🛠️"
    })
})

// Função que realiza o login do bot
client.login(config.token);
// Seta a Collection de Comando
client.commands = new Discord.Collection();
// Seta a Collection de Aliase
client.aliases = new Discord.Collection();

// Handlers

client.on("interactionCreate",(interaction)=>{
    if (interaction.type===Discord.InteractionType.ApplicationCommand){
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply("Error");
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id)
        
        cmd.run(client,interaction)
    }
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

const interactionBP = require("./events/interactionBP");

client.on("interactionCreate", async (interaction) => {
    await interactionBP(client, interaction) ;
  }
)

process.on('uncaughtException', (error, origin) => {
    console.log(`Erro Detectado:\n\n${error.stack}`);
  });
  
  process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`Erro Detectado:\n\n${error.stack}`);
  });