const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

const fetchUrls = async () => {
  try {
    const data = fs.readFileSync('url.json', 'utf8');
    const urls = JSON.parse(data).urls;

    const fetchPromises = urls.map(url => axios.get(url));
    const responses = await Promise.all(fetchPromises);

    responses.forEach((response, index) => {
      console.log(`Fetched data from ${urls[index]}:`, response.data);
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const fetchInterval = 15000; // 15 seconds in milliseconds

const fetchDataRepeatedly = async () => {
  while (true) {
    await fetchUrls();
    await new Promise(resolve => setTimeout(resolve, fetchInterval));
  }
};

app.get('/add', (req, res) => {
  const { url } = req.query;

  if (url) {
    try {
      const data = fs.readFileSync('url.json', 'utf8');
      const urls = JSON.parse(data).urls;

      urls.push(url);

      fs.writeFileSync('url.json', JSON.stringify({ urls }, null, 2));

      res.send('URL added successfully');
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('Error adding URL');
    }
  } else {
    res.status(400).send('URL parameter is required');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  fetchDataRepeatedly();
});
