const Discord = require("discord.js")
const config = require("../../config/config.json")

module.exports = {
    name:"ping",
    description:"[Utility] Comando para verificar o ping",
    type: Discord.ApplicationCommandType.ChatInput,
    run: async(client,interaction)=>{
        let ping = client.ws.ping;
        let embed_1 = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Olá ${interaction.user}, meu ping está em \`${ping}ms\`.`)
        .setColor(config.embedcolor);

        interaction.reply({ embeds: [embed_1] , ephemeral : true }).then(() => {setTimeout( () => {}, 2000)})
    },
}