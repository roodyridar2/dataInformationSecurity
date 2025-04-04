import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Modal,
  Row,
  Col,
  Typography,
  Tooltip,
  message,
  Tabs,
} from "antd";
import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CaesarCipherWheel from "../components/CaesarCipherWheel";
import TabsUi from "../components/Tabs";
import MonoalphabeticCipherCalculator from "../components/MonoalphabeticCipherCalculator";

const { Title, Text } = Typography;

// ---------------- Caesar Cipher Functions ----------------
const caesarEncrypt = (plaintext, shift) => {
  let ciphertext = "";
  for (let i = 0; i < plaintext.length; i++) {
    let charCode = plaintext.charCodeAt(i);
    let shiftedCharCode = (charCode + shift) % 256;
    ciphertext += String.fromCharCode(shiftedCharCode);
  }
  return ciphertext;
};
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
const caesarDecrypt = (ciphertext, shift) => {
  let characters = getPrintableCharacters();
  let characterMap = {};

  characters.forEach((char, index) => {
    characterMap[char] = index;
  });

  let decryptedText = "";
  for (let char of ciphertext) {
    if (!(char in characterMap)) {
      console.error("Error: Unrecognized character in input.");
      return "";
    }
    let newIndex =
      (characterMap[char] - shift + characters.length) % characters.length;
    decryptedText += characters[newIndex];
  }
  return decryptedText;
};

const caesarAttack = (ciphertext) => {
  const results = [];
  for (let s = 0; s < 256; s++) {
    results.push({ shift: s, text: caesarDecrypt(ciphertext, s) });
  }
  return results;
};

// ---------------- Monoalphabetic Cipher Functions ----------------
function generateShuffledKeyMap() {
  let chars = [];
  for (let i = 0; i < 256; i++) {
    chars.push(String.fromCharCode(i));
  }
  // Simple shuffle using sort with random comparator
  let shuffled = chars.slice().sort(() => Math.random() - 0.5);
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

const Day1 = () => {
  // ---------- Caesar Cipher States ----------
  const [caesarPlaintext, setCaesarPlaintext] = useState("");
  const [caesarShift, setCaesarShift] = useState(0);
  const [caesarEncrypted, setCaesarEncrypted] = useState("");

  const [caesarCiphertext, setCaesarCiphertext] = useState("");
  const [caesarShiftDecrypt, setCaesarShiftDecrypt] = useState(0);
  const [caesarDecrypted, setCaesarDecrypted] = useState("");

  const [bruteForceCiphertext, setBruteForceCiphertext] = useState("");
  const [bruteForceResults, setBruteForceResults] = useState([]);

  // ---------- Monoalphabetic Cipher States ----------
  const [monoPlaintext, setMonoPlaintext] = useState("");
  const [monoEncrypted, setMonoEncrypted] = useState("");
  const [monoCiphertext, setMonoCiphertext] = useState("");
  const [monoDecrypted, setMonoDecrypted] = useState("");
  const [monoKeyMap, setMonoKeyMap] = useState(generateShuffledKeyMap());

  // ---------- Modal Visibility States ----------
  const [visibleCaesarCode, setVisibleCaesarCode] = useState(false);
  const [visibleMonoCode, setVisibleMonoCode] = useState(false);

  // ---------- Helper: Copy Text to Clipboard ----------
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  // ---------- Reset Handlers ----------
  const resetCaesarEncryption = () => {
    setCaesarPlaintext("");
    setCaesarShift(0);
    setCaesarEncrypted("");
  };

  const resetCaesarDecryption = () => {
    setCaesarCiphertext("");
    setCaesarShiftDecrypt(0);
    setCaesarDecrypted("");
  };

  const resetBruteForce = () => {
    setBruteForceCiphertext("");
    setBruteForceResults([]);
  };

  const resetMonoEncryption = () => {
    setMonoPlaintext("");
    setMonoEncrypted("");
  };

  const resetMonoDecryption = () => {
    setMonoCiphertext("");
    setMonoDecrypted("");
  };

  // ---------- Handlers for Caesar Cipher ----------
  const handleCaesarEncrypt = () => {
    const shiftVal = parseInt(caesarShift, 10);
    const result = caesarEncrypt(caesarPlaintext, shiftVal);
    setCaesarEncrypted(result);
  };

  const handleCaesarDecrypt = () => {
    const shiftVal = parseInt(caesarShiftDecrypt, 10);
    const result = caesarDecrypt(caesarCiphertext, shiftVal);
    setCaesarDecrypted(result);
  };

  const handleCaesarAttack = () => {
    const results = caesarAttack(bruteForceCiphertext);
    setBruteForceResults(results);
  };

  // ---------- Handlers for Monoalphabetic Cipher ----------
  const handleMonoEncrypt = () => {
    const result = monoalphabeticEncrypt(monoPlaintext, monoKeyMap);
    setMonoEncrypted(result);
  };

  const handleMonoDecrypt = () => {
    const result = monoalphabeticDecrypt(monoCiphertext, monoKeyMap);
    setMonoDecrypted(result);
  };

  const handleGenerateNewKey = () => {
    const newKeyMap = generateShuffledKeyMap();
    setMonoKeyMap(newKeyMap);
    message.success("New key generated!");
  };

  // ---------- Code Strings for Modals ----------
  const caesarCodeString = `//
  //-----------------Caesar Cipher Functions
function caesarEncrypt(plaintext, shift) {
      let ciphertext = '';
      for (let i = 0; i < plaintext.length; i++) {
          let charCode = plaintext.charCodeAt(i);
          let shiftedCharCode = (charCode + shift) % 256;
          ciphertext += String.fromCharCode(shiftedCharCode);
      }
      return ciphertext;
  }


//-----------------Caesar caesar Decrypt
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


----------------- caesar Attack 
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
        console.log("Shift {shift}: {decryptCaesarCipher(cipherText, shift)}");
    }
}


`;

  const monoCodeString = `// Monoalphabetic Cipher Functions using a shuffled key map
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
}`;

  // ---------- Styles ----------
  const containerStyle = {
    background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
    minHeight: "100vh",
    padding: "24px",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const sectionSpacing = { marginBottom: "24px" };

  return (
    <div style={containerStyle} className="rounded-2xl">
      <Title style={{ textAlign: "center", marginBottom: "40px" }}>
        Modern Cipher Tools
      </Title>
      <Row gutter={[24, 24]}>
        {/* ---------- Caesar Cipher Section ---------- */}
        <Col xs={24} md={12}>
          <Card
            title="Caesar Cipher"
            style={cardStyle}
            extra={
              <Button type="primary" onClick={() => setVisibleCaesarCode(true)}>
                Show Code
              </Button>
            }
          >
            {/* Encryption */}
            <div style={sectionSpacing}>
              <Title level={4}>Encryption</Title>
              <Input
                placeholder="Enter plaintext"
                value={caesarPlaintext}
                onChange={(e) => setCaesarPlaintext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Tooltip title="Enter a numeric shift value">
                <Input
                  placeholder="Enter shift value"
                  type="number"
                  value={caesarShift}
                  onChange={(e) => setCaesarShift(e.target.value)}
                  style={{ marginBottom: "12px" }}
                />
              </Tooltip>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleCaesarEncrypt}>
                  Encrypt
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetCaesarEncryption}
                >
                  Reset
                </Button>
              </div>
              {caesarEncrypted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    position: "relative",
                  }}
                >
                  <Text strong>Encrypted Ciphertext:</Text>
                  <br />
                  <Text code>{caesarEncrypted}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(caesarEncrypted)}
                    style={{ position: "absolute", top: "8px", right: "8px" }}
                  />
                </motion.div>
              )}
            </div>

            {/* Decryption */}
            <div style={sectionSpacing}>
              <Title level={4}>Decryption</Title>
              <Input
                placeholder="Enter ciphertext"
                value={caesarCiphertext}
                onChange={(e) => setCaesarCiphertext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Tooltip title="Enter a numeric shift value">
                <Input
                  placeholder="Enter shift value"
                  type="number"
                  value={caesarShiftDecrypt}
                  onChange={(e) => setCaesarShiftDecrypt(e.target.value)}
                  style={{ marginBottom: "12px" }}
                />
              </Tooltip>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleCaesarDecrypt}>
                  Decrypt
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetCaesarDecryption}
                >
                  Reset
                </Button>
              </div>
              {caesarDecrypted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    position: "relative",
                  }}
                >
                  <Text strong>Decrypted Plaintext:</Text>
                  <br />
                  <Text code>{caesarDecrypted}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(caesarDecrypted)}
                    style={{ position: "absolute", top: "8px", right: "8px" }}
                  />
                </motion.div>
              )}
            </div>

            {/* Brute Force Attack */}
            <div style={sectionSpacing}>
              <Title level={4}>Brute Force Attack</Title>
              <Input
                placeholder="Enter ciphertext for attack"
                value={bruteForceCiphertext}
                onChange={(e) => setBruteForceCiphertext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleCaesarAttack}>
                  Run Brute Force Attack
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetBruteForce}>
                  Clear Results
                </Button>
              </div>
              {bruteForceResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "16px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "12px",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  {bruteForceResults.map((result) => (
                    <div key={result.shift}>
                      <Text strong>Shift {result.shift}:</Text>{" "}
                      <Text code>{result.text}</Text>
                    </div>
                  ))}
                </motion.div>
              )}
              <Text
                type="secondary"
                style={{ display: "block", marginTop: "12px" }}
              >
                The brute force attack tests all possible shift values (0–255)
                until the decrypted text is intelligible.
              </Text>
            </div>
            {/* take extra space to make equal */}
            <div 
            className="h-18  lg:h-24 md:h-24 "
            ></div>
          </Card>
        </Col>

        {/* ---------- Monoalphabetic Cipher Section ---------- */}
        <Col xs={24} md={12}>
          <Card
            title="Monoalphabetic Cipher"
            style={cardStyle}
            extra={
              <Button type="primary" onClick={() => setVisibleMonoCode(true)}>
                Show Code
              </Button>
            }
          >
            {/* Key Generation & Display */}
            <div style={sectionSpacing}>
              <Title level={4}>Key Generation</Title>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <Button type="primary" onClick={handleGenerateNewKey}>
                  Generate New Key
                </Button>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() =>
                    copyToClipboard(JSON.stringify(monoKeyMap, null, 2))
                  }
                >
                  Copy Key
                </Button>
              </div>
            </div>
            <div style={sectionSpacing}>
              <Title level={4}>Current Key Map</Title>
              <div style={{ position: "relative" }}>
                <pre
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    padding: "12px",
                  }}
                >
                  {JSON.stringify(monoKeyMap, null, 2)}
                </pre>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() =>
                    copyToClipboard(JSON.stringify(monoKeyMap, null, 2))
                  }
                  style={{ position: "absolute", top: "8px", right: "8px" }}
                />
              </div>
            </div>
            {/* Encryption */}
            <div style={sectionSpacing}>
              <Title level={4}>Encryption</Title>
              <Input
                placeholder="Enter plaintext"
                value={monoPlaintext}
                onChange={(e) => setMonoPlaintext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleMonoEncrypt}>
                  Encrypt
                </Button>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={resetMonoEncryption}
                >
                  Reset
                </Button>
              </div>
              {monoEncrypted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    position: "relative",
                  }}
                >
                  <Text strong>Encrypted Ciphertext:</Text>
                  <br />
                  <Text code>{monoEncrypted}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(monoEncrypted)}
                    style={{ position: "absolute", top: "8px", right: "8px" }}
                  />
                </motion.div>
              )}
            </div>

            {/* Decryption */}
            <div style={sectionSpacing}>
              <Title level={4}>Decryption</Title>
              <Input
                placeholder="Enter ciphertext"
                value={monoCiphertext}
                onChange={(e) => setMonoCiphertext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleMonoDecrypt}>
                  Decrypt
                </Button>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={resetMonoDecryption}
                >
                  Reset
                </Button>
              </div>
              {monoDecrypted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    position: "relative",
                  }}
                >
                  <Text strong>Decrypted Plaintext:</Text>
                  <br />
                  <Text code>{monoDecrypted}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(monoDecrypted)}
                    style={{ position: "absolute", top: "8px", right: "8px" }}
                  />
                </motion.div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ---------- Caesar Code Modal ---------- */}
      <Modal
        title="Caesar Cipher Code"
        visible={visibleCaesarCode}
        footer={null}
        onCancel={() => setVisibleCaesarCode(false)}
        width={800}
      >
        <div style={{ marginBottom: "12px", textAlign: "right" }}>
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(caesarCodeString)}
          >
            Copy Code
          </Button>
        </div>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {caesarCodeString}
        </SyntaxHighlighter>
      </Modal>

      {/* ---------- Monoalphabetic Code Modal ---------- */}
      <Modal
        title="Monoalphabetic Cipher Code"
        visible={visibleMonoCode}
        footer={null}
        onCancel={() => setVisibleMonoCode(false)}
        width={800}
      >
        <div style={{ marginBottom: "12px", textAlign: "right" }}>
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(monoCodeString)}
          >
            Copy Code
          </Button>
        </div>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {monoCodeString}
        </SyntaxHighlighter>
      </Modal>
      {/* TAbs */}
      <div>
        <TabsUi
          tabs={[
            {
              id: "caesar-cipher",
              label: "Caesar Cipher",
              content: <CaesarCipherWheel />,
            },
            {
              id: "Monoalphabetic-cipher",
              label: "Monoalphabetic Cipher",
              content: <MonoalphabeticCipherCalculator />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Day1;
