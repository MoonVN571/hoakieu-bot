const CryptoJS = require('crypto-js');
module.exports.encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.CRYPT).toString();
};
module.exports.decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPT);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};