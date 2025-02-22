function getPrintableCharacters() {
    let characters = [];
    for (let i = 32; i < 127; i++) { // Limiting to standard printable ASCII
        characters.push(String.fromCharCode(i));
    }
    return characters;
}

function decryptCaesarCipher(text, shift) {
    let characters = getPrintableCharacters();
    let decryptedText = "";

    for (let char of text) {
        let code = char.charCodeAt(0);
        // Only shift letters; leave all other characters unchanged.
        if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
            decryptedText += char;
            continue;
        }
        let index = characters.indexOf(char);
        let newIndex = (index - shift + characters.length) % characters.length;
        decryptedText += characters[newIndex];
    }
    return decryptedText;
}

function caesarAttack(cipherText) {
    let characters = getPrintableCharacters();
    for (let shift = 0; shift < characters.length; shift++) {
        console.log(`Shift ${shift}: ${decryptCaesarCipher(cipherText, shift)}`);
    }
}

// Example usage:
let encryptedText = "Khoor Zruog!";
caesarAttack(encryptedText);
