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

// Fetch from DuckDuckGo API
const fetchFromDuckDuckGo = async (query) => {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json`;
    const response = await axios.get(url);
    const answer = response.data.AbstractText;
    return answer || null;
  } catch (err) {
    console.error("DuckDuckGo error:", err.message);
    return null;
  }
};

// Fallback: Fetch from Wikipedia Summary API
const fetchFromWikipedia = async (query) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(url);

    if (response.data.extract) {
      return response.data.extract;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Wikipedia error:", err.message);
    return null;
  }
};

// Final function: Try DuckDuckGo, then Wiki
const fetchAnswer = async (query) => {
  let answer = await fetchFromDuckDuckGo(query);
  if (answer) return answer;

  answer = await fetchFromWikipedia(query);
  if (answer) return answer;

  return "😕 I couldn't find an answer. Try rephrasing or asking something simpler.";
};

// Telegram Bot Message Handling
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const question = msg.text;

  await bot.sendMessage(chatId, "Thinking hard on this one... 🧠💭");

  const reply = await fetchAnswer(question);

  await bot.sendMessage(chatId, reply);
});
