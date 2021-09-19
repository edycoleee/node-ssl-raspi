"use strick";

const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();



const options = {
  host: "dvlp.bpjs-kesehatan.go.id",
  port: ":8888",
  service: "vclaim-rest-1.1",
};

const aplicareOptions = {
  host: "dvlp.bpjs-kesehatan.go.id",
  port: ":8888",
  service: "aplicaresws",
};

const uri = `https://${options.host}/${options.service}/`;
const aplicareuri = `https://${aplicareOptions.host}${aplicareOptions.port}/${aplicareOptions.service}/`;

module.exports = {
  uri,
  aplicareuri,
};
