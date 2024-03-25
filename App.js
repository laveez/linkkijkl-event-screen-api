const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

app.get('/events', async (req, res) => {
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

app.get('/lunch', async (req, res) => {
  try {
    // Get current date in the format 'yyyy-mm-dd'
    const date = new Date().toISOString().split('T')[0];
    // Use the current date in the API endpoint
    const response = await axios.get(
      `https://www.semma.fi/api/restaurant/menu/day` +
      `?date=${date}` +
      `&language=fi` +
      `&onlyPublishedMenu=true` +
      `&restaurantPageId=207735`
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/sponsors', async (req, res) => {
  try {
    const response = await axios.get('https://linkkijkl.fi/api/sponsors.json');
    const sponsors = response.data;
    const imageUrls = Object.keys(sponsors).map(key => `https://linkkijkl.fi${sponsors[key].image}`);
    res.send(imageUrls);
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});
