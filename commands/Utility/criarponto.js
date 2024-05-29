// Template de Comando Simples

const Discord = require("discord.js") // require da biblioteca do discord.js
const config = require("../../config/config.json") //require do local das configurações

module.exports = {
   name:"criarponto", // Especificar nome do comando
   description:"cria mensagem de ponto", // Especificar a descrição do comando
   type: Discord.ApplicationCommandType.ChatInput, // Especificar o tipo de comando
   run: async(client,interaction)=>{ 
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        interaction.reply({ content: `<:icons_Wrong75:1198037616956821515> | Você não possui permissão para utilizar este comando.`, ephemeral: true })
      } else {
        let embed = new Discord.EmbedBuilder()
          .setAuthor({ name: client.user.username })
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(`
          ### CONTROLE DE PONTO VIRTUAL

          **ABRIR PONTO** 
          Clique neste botão para iniciar o registro do seu expediente.

          **FECHAR PONTO** 
          Ao encerrar suas atividades, clique neste botão para registrar o término do expediente.

          *Mantenha seus registros em dia e garanta uma gestão eficiente do seu tempo de trabalho.*
          `)
          .setColor(config.embedcolor)
          .setFooter({ text: 'Manutenção por @cyberdarkbr'});

        let button = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('abrirponto')
              .setLabel('Abrir Ponto')
              .setStyle(3),
            new Discord.ButtonBuilder()
              .setCustomId('fecharponto')
              .setLabel('Fechar Ponto')
              .setStyle(4)
          );
        interaction.reply({ content: `Mensagem enviada com sucesso.`, ephemeral: true })
        interaction.channel.send({ embeds: [embed], components: [button] })


      }
}
}