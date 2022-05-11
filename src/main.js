"use strict";

const express = require('express')
const RateLimit = require('express-rate-limit');
const cors = require("cors")

const app = express()
const timeSeriesRouter = require('./routes/timeSeriesRouter')

const PORT = 4005
const ENDPOINT = '/api/v1'

const corsOptions = {
  // origin: `http://localhost:${PORT}`
  origin: `*`
};

const apiLimiter = RateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to 100 requests
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests!",
})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(cors(corsOptions));
app.use(apiLimiter); // apply rate limiter to all requests
app.use((request, response, next) => {
  next();
});


// Next -> API and DB Security

//use routers
app.use(ENDPOINT, timeSeriesRouter); // -> middleware


app.listen(PORT, function(err){
  if (err) console.log("Error occured in server setup")
  console.log("Backend listening on Port: ", PORT);
})

/////////////////////////////////// SOCKET.IO ///////////////////////////////////
//
