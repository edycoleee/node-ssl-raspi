"use strick";

const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const creatHeader = () => {
  const consId = process.env.CONSID;
  const secret = process.env.SECRET;
  const user_key = process.env.USER_KEY;
  const tStamp = Math.floor(Date.now() / 1000);
  const data = consId + "&" + tStamp;

  const signature = Buffer.from(
    crypto.createHmac("SHA256", secret).update(data).digest()
  ).toString("base64");
  return {
    "X-cons-id": consId,
    "X-timestamp": tStamp,
    "X-signature": signature,
    user_key,
  };
};

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
  creatHeader,
  uri,
  aplicareuri,
};
