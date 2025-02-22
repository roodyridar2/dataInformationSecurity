function getPrintableCharacters() {
    let characters = [];
    for (let i = 0; i < 256; i++) {
        let character = String.fromCharCode(i);
        if (character.trim() !== "" || character === " ") { 
            characters.push(character);
        }
    }
    return characters;
}

function decryptCaesarCipher(text, shift) {
    let characters = getPrintableCharacters();
    let characterMap = {};
    
    characters.forEach((char, index) => {
        characterMap[char] = index;
    });

    let decryptedText = "";
    for (let char of text) {
        if (!(char in characterMap)) {
            console.error("Error: Unrecognized character in input.");
            return "";
        }
        let newIndex = (characterMap[char] - shift + characters.length) % characters.length;
        decryptedText += characters[newIndex];
    }
    
    return decryptedText;
}

// Testing with a new example
let encryptedMessage = "Wklv lv d whvw phvvdjh!";
let shiftValue = 3;
let result = decryptCaesarCipher(encryptedMessage, shiftValue);
console.log("Decrypted Message:", result);
