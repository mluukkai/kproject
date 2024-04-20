const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const axios = require('axios');
const fs = require('fs');

app.set('view engine', 'ejs');

async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filename, response.data);
}

app.use(express.static('pics'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const request = await axios.get('http://todo-backend-svc:2345/todos');
  const todos = request.data;
  console.log('Getting index')
  res.render('index', { todos });
});

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

function calculateDateDifferenceInMinutes(date1, date2) {
  const diffInMilliseconds = Math.abs(date2 - date1);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return diffInMinutes;
}

const age = (FILE) => {
  try {
    const { birthtime } = fs.statSync(FILE);
    console.log(birthtime);
    return birthtime;
  } catch (err) {
    console.error(err);
  }
  return null
}

app.get('/picture.jpg', async (req, res) => {
  console.log('Getting image');
  const FILE = 'pics/image.jpg';

  const birthtime = age(FILE);

  const currentDate = new Date();
  const minutesDifference = !birthtime ? 10000 : calculateDateDifferenceInMinutes(birthtime, currentDate);

  console.log('Minutes difference:', minutesDifference);

  if (minutesDifference > 60) {
    console.log('Downloading new image');
    if (birthtime) { 
      console.log('Deleting old image');
      fs.unlinkSync(FILE);
    }
    await downloadImage('https://picsum.photos/1200', FILE);
  }

  res.sendFile(__dirname + '/' + FILE);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});