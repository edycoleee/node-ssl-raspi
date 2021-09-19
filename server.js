const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const LZString = require("lz-string");
const { uri } = require("./ambilSigna");
dotenv.config();

const app = express();
app.listen(3000, () => console.log("listening at 3000"));

app.get("/poli/:nmpoli", async (request, response) => {
  console.log("cari poli");
  const nmpoli = request.params.nmpoli;
  const api_url = `${uri}referensi/poli/${nmpoli}`;
  console.log(api_url);

  const consId = process.env.CONSID;
  const secret = process.env.SECRET;
  const user_key = process.env.USER_KEY;
  const tStamp = Math.floor(Date.now() / 1000);
  const data = consId + "&" + tStamp;
  console.log(data);
  const signature = Buffer.from(
    crypto.createHmac("SHA256", secret).update(data).digest()
  ).toString("base64");

  axios
    .get(api_url, {
      headers: {
        "X-cons-id": consId,
        "X-timestamp": tStamp,
        "X-signature": signature,
        user_key,
      },
    })
    .then((response) => {
      console.log("response: ", response.data.response);
      console.log("status: ", response.status);
      console.log("statusText: ", response.statusText);
      return response.data.response;
    })
    .then((data) => {
      console.log("data", data);
      //   function stringDecrypt($string){
      function stringDecrypt(data) {
        //   $output = false;
        let output = false;
        //   $encrypt_method = 'AES-256-CBC';
        const encrypt_method = "aes-256-cbc";
        //   global $consID, $secretKey, $stamp;
        console.log(consId, secret, tStamp.toString());
        const signature1 = consId + secret + tStamp.toString();
        //   $signature = $consID . $secretKey . $stamp;
        //   // hash
        console.log(signature1);
        const key = crypto
          .createHash("sha256")
          .update(signature1, "utf-8")
          .digest("hex");
        //   $key = hex2bin(hash('sha256', $signature));
        //     // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        //   $iv = substr(hex2bin(hash('sha256', $signature)), 0, 16);
        console.log("key", key);
        console.log("Key length (bits):", key.length * 8);
        const iv = crypto
          .createHash("sha256")
          .update(signature1, "utf-8")
          .digest("hex")
          .substring(0, 16);
        console.log("iv", iv);
        console.log("IV length (bits):", iv.length * 8);

        //const cipherText = Buffer.from(data, "base64");
        //console.log("cipherText", cipherText);

        //const hasil = Buffer.concat([cipher.update(cipherText), cipher.final()]).toString("base64");
        //console.log("hasil",hasil);
        const buf = Buffer.from(data, "base64");
        console.log("buf", buf);
        const crypt = buf.toString("base64");
        console.log("crypt", crypt);

        console.log("decryptor crypto", encrypt_method, key, iv);
        const decryptor = crypto.createDecipheriv(encrypt_method, key, iv);
        console.log("decryptor", decryptor);

        let resultDecryptor = decryptdecryptor.update(buf);
        resultDecryptor += decryptor.final();
        console.log("hasil1", resultDecryptor);
        //return resultDecryptor;
        //   $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, OPENSSL_RAW_DATA, $iv);
        //     return $output;
        // }
      }
      stringDecrypt(data);
    })
    .then((hasilDecrypt) => {
      console.log("hasil", hasilDecrypt);
      const decryptedData = stringDecrypt(data);
      console.log("decrypted", decryptedData);
      const Lstring = LZString.decompress(decryptedData);
      console.log("Lstring", Lstring);
    })
    .catch(function (error) {
      // handle error
      console.log("status: ", error.response);
    })
    .then((response) => {
      console.log("selesai");
    });
});
