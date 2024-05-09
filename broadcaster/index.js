const { Webhook } = require('discord-webhook-node');
const NATS = require('nats')
const nc = NATS.connect({
  url: process.env.NATS_URL || 'nats://nats:4222'
})

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const webhook_url = process.env.DISCORD_WEBHOOK;
console.log('webhook', webhook_url);
const hook = new Webhook(webhook_url);
hook.setUsername('broadcaster');
const IMAGE_URL = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';
hook.setAvatar(IMAGE_URL); 

app.get('/', async (req, res) => {
  res.send('Hello World!')
})

app.get('/chat', async (req, res) => { 
  hook.send("Hello there!");
  res.send('sent message to discord!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

nc.subscribe('todo_info', { queue: 'todo.broadcasters' }, (msg) => {
  const payload = JSON.parse(msg)
  const { title, status } = payload
  console.log(`${title}: ${status}`)

  hook.send("A message from the broadcaster! " + msg);
})

console.log('Saver listening')