function generateShuffledKeyMap() {
    let chars = [];
    for (let i = 0; i < 256; i++) chars.push(String.fromCharCode(i));

    // Shuffle using a simple loop
    for (let i = chars.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]]; // Swap elements
    }

    let keyMap = {};
    for (let i = 0; i < 256; i++) {
        keyMap[String.fromCharCode(i)] = chars[i];
    }
    return keyMap;
}


function monoalphabeticDecrypt(text, keyMap) {
    let reverseKeyMap = {};
    for (let key in keyMap) {
        reverseKeyMap[keyMap[key]] = key;
    }

    let result = "";
    for (let char of text) {
        result += reverseKeyMap[char] || char;
    }
    return result;
}


let keyMap = generateShuffledKeyMap();


let encrypted = "";

let decrypted = monoalphabeticDecrypt(encrypted, keyMap);
console.log("Decrypted:", decrypted);