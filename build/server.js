var express = require('express');
var dotenv = require('dotenv');
dotenv.config();
var app = express();
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(port, function () {
  console.log("Api is listening at http://localhost:".concat(port));
});
