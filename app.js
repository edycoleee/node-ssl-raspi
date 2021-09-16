const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h2> Siap WS BPJS server Node JS</h2>");
});

app.listen(5000, () => {
  console.log("app listen on port 5000");
});
