import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
var app = express();
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(port, function () {
  console.log("Api is listening on port ".concat(port));
});
