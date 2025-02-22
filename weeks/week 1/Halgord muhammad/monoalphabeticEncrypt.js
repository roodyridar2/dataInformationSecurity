function generateShuffledKeyMap() {
    let chars = [];
    for (let i = 0; i < 256; i++) chars.push(String.fromCharCode(i));

    let shuffled = chars.slice().sort(() => Math.random() - 0.5); // Simple shuffle

    let keyMap = {};
    for (let i = 0; i < chars.length; i++) {
        keyMap[chars[i]] = shuffled[i];
    }
    return keyMap;
}

function monoalphabeticEncrypt(text, keyMap) {
    let result = "";
    for (let char of text) {
        result += keyMap[char] || char;
    }
    return result;
}
let keyMap = generateShuffledKeyMap();
let plaintext = "halgurd";

let encrypted = monoalphabeticEncrypt(plaintext, keyMap);
console.log("Encrypted:", encrypted);