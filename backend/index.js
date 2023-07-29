const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { config } = require("dotenv");
config();

const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(
  new Configuration({
    apiKey: "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",
  })
);

function chatWithAI() {
  let conversationHistory = [];

  io.on("connection", (socket) => {
    console.log("User connected.");
    socket.emit("chat", "AI : Welcome to the AI Prompt !");
    socket.emit("chat", "AI : You can end the interview anytime by saying 'STOP'.");

    socket.on("chat", async (userInput) => {
      
      console.log(userInput)
      if (userInput.toLowerCase() === "stop") {
        socket.emit("chat", "Interview Ended.");
        socket.disconnect(true);
        return;
      }
      // if (userInput!==`give me ${course} interview questions`){
        
        // }
        socket.emit("chat", `You : ${userInput}`);
      conversationHistory.push({ role: "user", content: userInput });

      // Send the conversation history to GPT-3.5-turbo
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      });

      const aiResponse = res.data.choices[0].message.content;
      socket.emit("chat", "AI: " + aiResponse);

      // Add the AI's response to the conversation history
      conversationHistory.push({ role: "system", content: aiResponse });

      // Add a short delay to avoid rate limiting issues
      await sleep(1000);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected.");
      conversationHistory = [];
    });
  });
}

// Run the chat with AI function
chatWithAI();

httpServer.listen(5000, () => {
  console.log("Server listening on port 5000");
});
