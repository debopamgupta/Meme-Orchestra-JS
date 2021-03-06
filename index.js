require("dotenv").config();
const fetch = require("node-fetch");
const { Client, MessageEmbed } = require("discord.js");
const client = new Client();

const ChannelIDs = ["768017812844970014", "753989244015345726"];
const ServerIDs = ["723994197002289242", "720175341217513524"];
const prefix = "!";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

client.once("ready", () => {
  console.log("BEEP BOOP ! Ready!");
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (ChannelIDs.includes(msg.channel.id) && ServerIDs.includes(msg.guild.id)) {
    // Meme Handler
    if (command === `meme`) {
      await msg.react("🤣");
      const response = await fetch("https://www.reddit.com/r/memes/.json");
      const json = await response.json();
      const memeIndex = getRandomInt(1, json.data.dist);
      const memeUrl = json.data.children[memeIndex].data.url;
      const memeTitle = json.data.children[memeIndex].data.title;

      const MemeEmbed = new MessageEmbed()
        .setTitle("Meme")
        .setColor("#ff9966")
        .addField("Title", memeTitle, true)
        .setImage(memeUrl);

      await msg.channel.send(MemeEmbed);
    }

    // User Info Handler
    if (command === `user-info` || command === `userinfo`) {
      await msg.react("😎");
      const status = {
        online: "🟢 User is online!",
        idle: "🟡 User is idle, probably drinking a cup of tea",
        offline: "⚫ User is offline, probably sleeping ",
        dnd: "🔴 User doesn't want to be disturbed right now",
      };

      if (!args.length) {
        const userInfoEmbed = new MessageEmbed()
          .setColor("#ff9966")
          .setTitle("User Info")
          .setAuthor(msg.author.username)
          .setThumbnail(msg.author.avatarURL("PNG"))
          .addFields(
            {
              name: "👤 Username:",
              value: msg.author.username,
            },
            {
              name: "#️⃣ Tag:",
              value: msg.author.tag,
            },
            {
              name: "💳 ID:",
              value: msg.author.id,
            },
            {
              name: "🤖 Is a Bot? ",
              value: msg.author.bot ? "Yes" : "No",
            },
            {
              name: "🔰 Presence: ",
              value: status[msg.author.presence.status],
            },
            {
              name: "🎮 Activity: ",
              value:
                msg.author.presence.activities.length !== 0
                  ? msg.author.presence.activities[0].type +
                    " " +
                    msg.author.presence.activities[0].name
                  : "Nothing -_-",
            }
          );
        await msg.channel.send(userInfoEmbed);
      } else {
        const taggedUser = msg.mentions.users.first();
        const userInfoEmbed = new MessageEmbed()
          .setColor("#ff9966")
          .setTitle("User Info")
          .setAuthor(taggedUser.username)
          .setThumbnail(taggedUser.avatarURL("PNG"))
          .addFields(
            {
              name: "👤 Username:",
              value: taggedUser.username,
            },
            {
              name: "#️⃣ Tag:",
              value: taggedUser.tag,
            },
            {
              name: "💳 ID:",
              value: taggedUser.id,
            },
            {
              name: "🤖 Is a Bot? ",
              value: taggedUser.bot ? "Yes" : "No",
            },
            {
              name: "🔰 Presence: ",
              value: status[taggedUser.presence.status],
            },
            {
              name: "🎮 Activity: ",
              value:
                taggedUser.presence.activities.length !== 0
                  ? taggedUser.presence.activities[0].type +
                    " " +
                    taggedUser.presence.activities[0].name
                  : "Nothing -_-",
            }
          );

        await msg.channel.send(userInfoEmbed);
      }
    }

    // Help Handler
    if (command === "help") {
      const HelpEmbed = new MessageEmbed()
        .setColor("#ff9966")
        .setTitle("Help Message, Some of the commands you can use are")
        .addFields(
          {
            name: "!meme",
            value: "Get a random meme from reddit😂",
          },
          {
            name: "!userinfo or !user-info",
            value: "Get info about the message author.🤵",
          },
          {
            name: "!help or !halp",
            value: "Display this help message.📜",
          }
        );
      await msg.channel.send(HelpEmbed);
      await msg.react("🙋‍♂️");
    }

    // Welcome Handler
    if (command === "hello") {
      await msg.react("👋");
      await msg.channel.send(
        `Hi there! This is Meme-Generator-Bot. Primarily i can send you memes but if you want something more, type \`!help\``
      );
    }
  }
});

client.login(process.env.BOT_TOKEN);

// Uncomment for hosting on Repl.it so that the request to keep it awake goes through and ans 200 status code to continue
// const http = require("http");
// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end("ok");
// });
// server.listen(3000);
