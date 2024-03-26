const axios = require('axios');

const handleError = (err, res) => {
  console.error(err);
  res.status(500).send(err);
};

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};

module.exports = { handleError, fetchData };
