const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./events');
const lunchRoutes = require('./lunch');
const sponsorsRoutes = require('./sponsors');

const app = express();
app.use(cors());

app.use('/events', eventsRoutes);
app.use('/lunch', lunchRoutes);
app.use('/sponsors', sponsorsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});
