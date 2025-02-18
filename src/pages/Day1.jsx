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
} from "antd";
import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Title, Text } = Typography;

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
  const [monoShift, setMonoShift] = useState(0);
  const [monoEncrypted, setMonoEncrypted] = useState("");

  const [monoCiphertext, setMonoCiphertext] = useState("");
  const [monoShiftDecrypt, setMonoShiftDecrypt] = useState(0);
  const [monoDecrypted, setMonoDecrypted] = useState("");

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
    setMonoShift(0);
    setMonoEncrypted("");
  };

  const resetMonoDecryption = () => {
    setMonoCiphertext("");
    setMonoShiftDecrypt(0);
    setMonoDecrypted("");
  };

  // ---------- Cipher Functions (using Extended ASCII 0-255) ----------
  const caesarEncrypt = (plaintext, shift) => {
    return plaintext
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode((code + shift + 256) % 256);
      })
      .join("");
  };

  const caesarDecrypt = (ciphertext, shift) => {
    return ciphertext
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode((code - shift + 256) % 256);
      })
      .join("");
  };

  const caesarAttack = (ciphertext) => {
    const results = [];
    for (let s = 0; s < 256; s++) {
      results.push({ shift: s, text: caesarDecrypt(ciphertext, s) });
    }
    return results;
  };

  // Monoalphabetic cipher simulated with the same shift logic
  const monoalphabeticEncrypt = (plaintext, shift) =>
    caesarEncrypt(plaintext, shift);
  const monoalphabeticDecrypt = (ciphertext, shift) =>
    caesarDecrypt(ciphertext, shift);

  // ---------- Handlers ----------
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

  const handleMonoEncrypt = () => {
    const shiftVal = parseInt(monoShift, 10);
    const result = monoalphabeticEncrypt(monoPlaintext, shiftVal);
    setMonoEncrypted(result);
  };

  const handleMonoDecrypt = () => {
    const shiftVal = parseInt(monoShiftDecrypt, 10);
    const result = monoalphabeticDecrypt(monoCiphertext, shiftVal);
    setMonoDecrypted(result);
  };

  // ---------- Code Strings for Modals ----------
  const caesarCodeString = `// Caesar Cipher Functions
const caesarEncrypt = (plaintext, shift) => {
  return plaintext
    .split("")
    .map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode((code + shift + 256) % 256);
    })
    .join("");
};

const caesarDecrypt = (ciphertext, shift) => {
  return ciphertext
    .split("")
    .map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode((code - shift + 256) % 256);
    })
    .join("");
};

const caesarAttack = (ciphertext) => {
  const results = [];
  for (let s = 0; s < 256; s++) {
    results.push({ shift: s, text: caesarDecrypt(ciphertext, s) });
  }
  return results;
};`;

  const monoCodeString = `// Monoalphabetic Cipher Functions (using shift substitution)
const monoalphabeticEncrypt = (plaintext, shift) => caesarEncrypt(plaintext, shift);
const monoalphabeticDecrypt = (ciphertext, shift) => caesarDecrypt(ciphertext, shift);`;

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
    <div style={containerStyle } className=" rounded-2xl">
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
            {/* Encryption */}
            <div style={sectionSpacing}>
              <Title level={4}>Encryption</Title>
              <Input
                placeholder="Enter plaintext"
                value={monoPlaintext}
                onChange={(e) => setMonoPlaintext(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Tooltip title="Enter a numeric shift value">
                <Input
                  placeholder="Enter shift value"
                  type="number"
                  value={monoShift}
                  onChange={(e) => setMonoShift(e.target.value)}
                  style={{ marginBottom: "12px" }}
                />
              </Tooltip>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleMonoEncrypt}>
                  Encrypt
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetMonoEncryption}>
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
              <Tooltip title="Enter a numeric shift value">
                <Input
                  placeholder="Enter shift value"
                  type="number"
                  value={monoShiftDecrypt}
                  onChange={(e) => setMonoShiftDecrypt(e.target.value)}
                  style={{ marginBottom: "12px" }}
                />
              </Tooltip>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button type="primary" onClick={handleMonoDecrypt}>
                  Decrypt
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetMonoDecryption}>
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
        {/* <pre style={codeModalStyle}> */}
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {caesarCodeString}
        </SyntaxHighlighter>
        {/* </pre> */}
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
        {/* <pre style={codeModalStyle}> */}
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {monoCodeString}
        </SyntaxHighlighter>
        {/* </pre> */}
      </Modal>
    </div>
  );
};

export default Day1;
