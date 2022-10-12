// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 console.log(decipher)
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

// var hw = encrypt("Some serious stuff")
// console.log(hw)
// console.log(decrypt(hw))

console.log(decrypt({
    iv: 'b5c7e6987d060ee40814a5a02709b1c2',
    encryptedData: 'b15cf6e5a0213dff8a29138f3f62ac6ec6d91e4eed6d3358123378cbc91c81b1'
  }))