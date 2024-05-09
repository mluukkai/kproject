const { Webhook } = require('discord-webhook-node');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const webhook_url = process.env.DISCORD_WEBHOOK;
console.log('webhook', webhook_url);
const hook = new Webhook(webhook_url);
hook.setUsername('broadcaster');
hook.setAvatar(IMAGE_URL); 

app.get('/', async (req, res) => {
  res.send('Hello World!')
})

app.get('/chat', async (req, res) => {
  const IMAGE_URL = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';
 
  hook.send("Hello there!");
  res.send('sent message to discord!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
