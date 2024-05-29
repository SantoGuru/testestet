const sqlite3 = require("sqlite3");
const config = require("../config/config.json"); // Substitua pelo caminho real do seu arquivo de configuração
const Discord = require("discord.js");
const fs = require("fs")

module.exports = async (client, interaction) => {
  const db_ponto = "ponto.db";
  const logchannel = config.channel_pontolog;

  const db = new sqlite3.Database(db_ponto);

  db.run(`
    CREATE TABLE IF NOT EXISTS pontos (
      usuario_id TEXT PRIMARY KEY,
      aberto INTEGER,
      intervalos TEXT
    )
  `);

  function fTempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const sRestantes = segundos % 60;

    return `${horas}h ${minutos}m ${sRestantes.toFixed(0)}s`;
  }

  function fecharPonto(idUsuario, interaction, client, canalLogId, db) {
    db.get(
      "SELECT * FROM pontos WHERE usuario_id = ?",
      [idUsuario],
      async (err, row) => {
        if (err) {
          console.error(err);
          return;
        }

        if (row.aberto) {
          const fechado = new Date();
          const aberto = new Date(row.aberto);
          const intervalo = (fechado - aberto) / 1000;

          // Atualiza o banco de dados com o intervalo
          const novosIntervalos = JSON.parse(row.intervalos);
          novosIntervalos.push(intervalo);

          db.run(
            "UPDATE pontos SET aberto = NULL, intervalos = ? WHERE usuario_id = ?",
            [JSON.stringify(novosIntervalos), idUsuario],
            (err) => {
              if (err) console.error(err);
            }
          );

          await interaction.reply({
            content: `> Ponto fechado! Intervalo: ${fTempo(intervalo)}`,
            ephemeral: true,
          });
          const canalLog = client.channels.cache.get(logchannel);
          if (canalLog) {
            canalLog.send(
              `> Ponto do usuário ${interaction.user} fechado com ${fTempo(
                intervalo
              )}.`
            );
          }
        } else {
          await interaction.reply({
            content: "> Você não tem um ponto aberto.",
            ephemeral: true,
          });
        }
      }
    );
  }

  if (!interaction.isButton()) return;

  const idUsuario = interaction.user.id;
  
  // Verifica se o usuário existe no banco de dados
  db.get("SELECT * FROM pontos WHERE usuario_id = ?",[idUsuario],async (err, row) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!row) {
        // Se o usuário não existir, adiciona ao banco de dados
        db.run('INSERT INTO pontos (usuario_id, aberto, intervalos) VALUES (?, NULL, "[]")',[idUsuario]);
      }
  
      if (interaction.customId === "abrirponto") {
        // Atualiza o campo 'aberto' no banco de dados
        db.run(
          "UPDATE pontos SET aberto = ? WHERE usuario_id = ?",
          [Date.now(), idUsuario],
          (err) => {
            if (err) console.error(err);
          }
        );
        // Verifica se row é definido antes de acessar a propriedade aberto
        if (row && row.aberto) {
          interaction.reply({
            content:
              "> Você ja tem um ponto aberto.",
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          content: "Ponto aberto!",
          ephemeral: true,
        });
        const canalLog = client.channels.cache.get(logchannel);
        if (canalLog) {
          canalLog.send({
            content: `> Ponto do usuário ${interaction.user} aberto.`,
          });
        }
      } else if (interaction.customId === "fecharponto") {
        fecharPonto(idUsuario, interaction, client, logchannel, db);
      }
    }
  );
};
