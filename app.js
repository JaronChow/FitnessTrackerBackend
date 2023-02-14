require("dotenv").config('./env');
const express = require("express")
const app = express();
const cors = require('cors');
const morgan = require("morgan");

// Setup your Middleware and API Router here
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api', require('./api'));

// app.use( (error,req,res) => {
//     res.send({
//         error: error.error,
//         name: error.name,
//         message: error.message
//         })
// })

// app.use(function(req, res, next) {
//     if (!req.headers.authorization) {
//       return res.status(403).json({ error: 'No credentials sent!' });
//     }
//     next();
//   });

// const client = require("./db/client");
// client.connect();
// app.use(express.urlencoded({extended:false}));
module.exports = app;
