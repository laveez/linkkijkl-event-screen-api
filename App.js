const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

app.get('/lunch', async (req, res) => {
  try {
    // Get current date in the format 'yyyy-mm-dd'
    const date = new Date().toISOString().split('T')[0];
    // Use the current date in the API endpoint
    const response = await axios.get(
      `https://www.semma.fi/api/restaurant/menu/day?date=${date}` +
      `&language=fi&onlyPublishedMenu=true&restaurantPageId=207735`
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/sponsors', async (req, res) => {
  try {
    const response = await axios.get('https://linkkijkl.fi/');
    const $ = cheerio.load(response.data); // use cheerio to parse HTML
    const imageUrls = $('.elementor-carousel-image').map((i, el) => {
      return $(el).css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    }).get();
    res.send(imageUrls);
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});
