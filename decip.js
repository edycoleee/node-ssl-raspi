const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const LZString = require("lz-string");

const { uri, creatHeader } = require("./ambilSigna");
const headers = creatHeader();
console.log(headers);
const data =
  "KWA7IqgFVNHUXFwD8xXSaJ1QJMVb6QTlWv5Dppr1RXqX6t8MdrjUKVjn4td+KPPM/JqCE8tqcbFmAkCQGBBy3HLNFz7XZ7uXehPcGMTHCfbp6Fhs+pSg9egiENXk6QB0";

function stringDecrypt(dstring) {
  const output = false;
  const encrypt_method = '"aes-256-cbc"';
  const headers = creatHeader();
  console.log(headers);
  console.log(headers["X-signature"]);
  // hash

  const passwordString = headers["X-signature"];
  const key = crypto.createHash("sha256").update(passwordString).digest();

  //const key = hash("sha256", headers.X - signature);
  // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
  //const iv = substr(hash("sha256", headers.X - signature), 0, 16);
  const iv = Buffer.alloc(16);
  output = decrypt(dstring, key, iv);
  return output;
}
const Algorithm = "aes-256-cbc";

function decrypt(cipherText, key, iv, outputEncoding = "base64") {
  console.log(cipherText, key, iv, outputEncoding);
  const cipher = crypto.createDecipheriv(Algorithm, key, iv);
  return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(
    outputEncoding
  );
}

const decryptedData = stringDecrypt(data);
console.log("decrypted", decryptedData);
const Lstring = LZString.decompress(decryptedData);
console.log("Lstring", Lstring);

function encrypt(plainText, key, iv, outputEncoding = "base64") {
  const cipher = crypto.createCipheriv(Algorithm, key, iv);
  const output = Buffer.concat([
    cipher.update(plainText),
    cipher.final(),
  ]).toString(outputEncoding);
  return output.replace("+", "-").replace("/", "_").replace("=", "");
}

const passwordString = "test password";

const KEY = crypto.createHash("sha256").update(passwordString).digest();
const IV = Buffer.alloc(16);

console.log("Key length (bits):", KEY.length * 8);
console.log("IV length (bits):", IV.length * 8);
const encrypted = encrypt("Brevity is the soul of wit", KEY, IV, "base64");
console.log("Encrypted (base64):", encrypted);
const decrypted = decrypt(encrypted, KEY, IV, "utf8");
console.log("Decrypted:", decrypted);

const app = express();
app.listen(3000, () => console.log("listening at 3000"));
