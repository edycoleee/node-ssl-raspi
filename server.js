const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const LZString = require("lz-string");
const { uri } = require("./ambilSigna");
const port = 3000;
dotenv.config();

const app = express();
app.listen(3000, () => console.log(`cli-nodejs-api listening at http://localhost:${port}`));

const consId = process.env.CONSID;
const secret = process.env.SECRET;
const user_key = process.env.USER_KEY;


app.get("/poli/:nmpoli", async (request, response) => {
  console.log("cari poli");
  const nmpoli = request.params.nmpoli;
  const api_url = `${uri}referensi/poli/${nmpoli}`;
  console.log(api_url);
  const tStamp = Math.floor(Date.now() / 1000);
  const keyString = consId+process.env.SECRET+tStamp;
  axios
    .get(api_url, {
      headers: genHeader(tStamp),
    })
    .then((response) => {
      //console.log(keyString);
      //console.log(response.data);
      //console.log("response", response.data.response);
      console.log("code", response.data.metaData.code);
      console.log("message", response.data.metaData.message);
      console.log(decompressV2(stringDecryptV2(keyString, response.data.response)));
    })
});

function genHeader(tStamp){
  const data = consId + "&" + tStamp;
  //console.log(data);
  const signature = Buffer.from(
    crypto.createHmac("SHA256", secret).update(data).digest()
  ).toString("base64");
  return {
    "X-cons-id": consId,
    "X-timestamp": tStamp,
    "X-signature": signature,
    user_key,
  };

}

function stringDecryptV2(key, string) {
  let key_hash = crypto.createHash('sha256').update(key, 'utf8').digest();
  let iv = key_hash.slice(0, 16, 'blob');
  try {
    let decipher = crypto.createDecipheriv('aes-256-cbc', key_hash, iv);
    let decrypted = decipher.update(string, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  } catch (e) {
    return null;
  }
}

function decompressV2(string)
{
  var decompores = LZString.decompressFromEncodedURIComponent(string);
  return decompores;
}

