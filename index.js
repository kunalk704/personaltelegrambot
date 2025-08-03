const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

//token fetched using botfather
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const text = msg.text;
  console.log(`Received message: ${text}`);
  bot.sendMessage(msg.chat.id, `You said: ${text}`);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to the TeleBot! How can I assist you today?"
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "How can I help you? Right now I can not do much as I am a simple bot. You can send me messages and I will echo them back to you. I can tell you some jokes, if you want to hear one, just type /joke."
  );
});
bot.onText(/\/joke/, async (msg) => {
  const joke = await axios.get(
    "https://official-joke-api.appspot.com/random_joke"
  );
  const setup = joke.data.setup;
  const punchline = joke.data.punchline;
  bot.sendMessage(
    msg.chat.id,
    `Here's a joke for you:\n\n${setup}\n\n${punchline}`
  );
});
