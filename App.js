const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

app.get('/events/linkki', async (req, res) => {
  try {
    const currentDate = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    const timeMin = currentDate.toISOString();
    const timeMax = twoMonthsFromNow.toISOString();
    const response = await axios.get(
      `https://clients6.google.com/calendar/v3/calendars/` +
      `c_g2eqt2a7u1fc1pahe2o0ecm7as@group.calendar.google.com/events` +
      `?calendarId=c_g2eqt2a7u1fc1pahe2o0ecm7as%40group.calendar.google.com` +
      `&singleEvents=true` +
      `&timeZone=Europe%2FHelsinki` +
      `&timeMin=${timeMin}` +
      `&timeMax=${timeMax}` +
      `&orderBy=startTime` +
      `&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/events/algo', async (req, res) => {
  try {
    // Fetch the HTML content from the URL
    const response = await axios.get('https://www.algojkl.com/tapahtumat');
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Initialize an array to store the events
    const events = [];

    // Extract the event information
    $('article.eventlist-event.eventlist-event--upcoming').each((i, el) => {
      const title = $(el).find('a.eventlist-title-link').text();
      const date = $(el).find('time.event-date').attr('datetime');

      // Format the information into a JSON object
      const event = {
        title,
        date,
      };

      // Add the event to the array
      events.push(event);
    });

    // Return the events as JSON
    res.json(events);
  } catch (err) {
    res.status(500).send(err);
  }
});

const getLunch = async (req, res, restaurantPageId) => {
  try {
    // Get current date in the format 'yyyy-mm-dd'
    const date = new Date().toISOString().split('T')[0];
    // Use the current date in the API endpoint
    const response = await axios.get(
      `https://www.semma.fi/api/restaurant/menu/day` +
      `?date=${date}` +
      `&language=fi` +
      `&onlyPublishedMenu=true` +
      `&restaurantPageId=${restaurantPageId}`
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

app.get('/lunch/piato', (req, res) => getLunch(req, res, 207735));
app.get('/lunch/maija', (req, res) => getLunch(req, res, 207659));

app.get('/sponsors/linkki', async (req, res) => {
  try {
    const response = await axios.get('https://linkkijkl.fi/api/sponsors.json');
    const sponsors = response.data;
    const imageUrls = Object.keys(sponsors).map(key => `https://linkkijkl.fi${sponsors[key].image}`);
    res.send(imageUrls);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/sponsors/algo', async (req, res) => {
  try {
    // Fetch the HTML content from the URL
    const response = await axios.get('https://www.algojkl.com/yhteistyot');
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Initialize an array to store the image URLs
    const imageUrls = [];

    // Extract the image URLs from the last .fluid-engine element which contains images
    $('.fluid-engine:has(img)').last().find('img').each((i, el) => {
      const imageUrl = $(el).attr('src');

      // Add the image URL to the array
      imageUrls.push(imageUrl);
    });

    // Return the image URLs as JSON
    res.json(imageUrls);
  } catch (err) {
    res.status(500).send(err);
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});
