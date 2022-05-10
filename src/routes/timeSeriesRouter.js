'use strict';

const router = require('express').Router();
const predict = require('../scripts/predict');
const ENDPOINT = '/timeseries'

//import verifyAuth from '../middlewares/verifyAuth';
//router.post('/devices', verifyAuth, deviceController.insertDevice);


//GET


// POST
router.post(`${ENDPOINT}/predict`, predict.handlePredict);
//router.post(`${ENDPOINT}/train`, predict.handleTrain);


module.exports = router;