const express = require('express');
const { fetchData, handleError } = require('./utils');
const { SEMMA_API_URL } = require('./config');

const router = express.Router();

router.get('/piato', (req, res) => getLunch(req, res, 207735));
router.get('/maija', (req, res) => getLunch(req, res, 207659));

const getLunch = async (req, res, restaurantPageId) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const url = `${SEMMA_API_URL}?date=${date}&language=fi&onlyPublishedMenu=true&restaurantPageId=${restaurantPageId}`;
    const data = await fetchData(url);
    res.send(data?.LunchMenu?.SetMenus || []);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = router;
