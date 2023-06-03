import React, { useState } from "react";
import { Input, Button, Select, Space, Col, Row, Image, message } from "antd";
import axios from "axios";
import "./CodeEditor.scss";
import { PlayCircleFilled } from "@ant-design/icons";

const { Option } = Select;

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [memory, setMemory] = useState("");
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [loading, setLoading] = useState(false);

  const languageOptions = [
    {
      id: 93,
      name: "JavaScript",
      defaultCode: "// the hello world program \nconsole.log('Hello World');",
    },
    { id: 71, name: "Python", defaultCode: "# Enter your Python code here" },
    {
      id: 54,
      name: "C++",
      defaultCode: "// the hello world program \n#include <iostream>\nusing namespace std;\n\nint main(){\n    cout << \"Hello World\";\n    return 0;\n}",
    },
    {
      id: 50,
      name: "C",
      defaultCode: `// the hello world program \n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}`,
    },
  ];
  
  
  
  const themeOptions = [
    { id: "light", name: "Light Theme" },
    { id: "dark", name: "Dark Theme" },
    // Add more theme options as needed
  ];

  const executeCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: selectedLanguage,
          stdin: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "62bb5c7156msh4e28a24592e2cafp1ccfabjsnc8441a9f7d8e",
          },
        }
      );

      const submissionId = response.data.token;
      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "62bb5c7156msh4e28a24592e2cafp1ccfabjsnc8441a9f7d8e",
          },
        }
      );

      console.log(result.data);

      setStatus(result.data.status.description);
      setMemory(result.data.memory);
      setTime(result.data.time);

      setOutput(result.data.stdout);
    } catch (error) {
      message.error('An error occurred while executing your code');
;
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    const selectedLanguageObj = languageOptions.find(
      (language) => language.id === value
    );
    setCode(selectedLanguageObj.defaultCode);
  };

  const handleThemeChange = (value) => {
    setSelectedTheme(value);
  };

  return (
    <>
      <div className="code-editor-header">
        <Image src={require("./atom53.png")} width={40} />
        <h1>Nucleus Code Editor</h1>
      </div>
      <Row>
        <Col flex="1 1 200px">
          <div className="code-editor">
            <div className="code-editor-body">
              <div className="code-editor-controls">
                <Space>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    placeholder="Select a language"
                  >
                    {languageOptions.map((language) => (
                      <Option key={language.id} value={language.id}>
                        {language.name}
                      </Option>
                    ))}
                  </Select>
                  {/* <Select
                    value={selectedTheme}
                    onChange={handleThemeChange}
                    placeholder="Select a theme"
                  >
                    {themeOptions.map((theme) => (
                      <Option key={theme.id} value={theme.id}>
                        {theme.name}
                      </Option>
                    ))}
                  </Select> */}
                  <Button
                    type="primary"
                    onClick={executeCode}
                    loading={loading}
                    style={{ background: "#354259" }}
                  >
                    <PlayCircleFilled style={{ marginRight: "5px" }} /> Run
                  </Button>
                </Space>
              </div>
              <div className="code-editor-content">
                <Input.TextArea
                  rows={20}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code"
                />
              </div>
            </div>
          </div>
        </Col>
        <Col flex="0 1 400px" className="rightColumn">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
              fontSize: "13px",
            }}
          >
            Input
          </div>
          <div className="output">
            <div className="input-textarea">
              <Input.TextArea
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input"
                style={{
                  resize: "none",
                  width: "98%",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#FDFAF6",
                  fontFamily: "monospace",
                }}
              />
            </div>
            <h4 style={{ display: "flex", alignItems: "flex-start" }}>
              Result
            </h4>
            <div className="output-info" style={{ display: "flex" }}>
              <div
                style={{
                  marginRight: "10px",
                  fontSize: "20px",
                  color: "#2CBB5D",
                  fontWeight: "500",
                }}
              >
                {status === "Accepted" ? "Successfuly Executed" : null}
              </div>
              {output ? (
                <div style={{ fontSize: "13px", color: "grey" }}>
                  Run Time: {(time * 10).toFixed(2)} ms{" "}
                  <div
                    style={{ fontSize: "13px", color: "grey", padding: "5px" }}
                  >
                    Memory: {memory} KB{" "}
                  </div>
                </div>
              ) : null}
            </div>

            {output ? (
              <div className="output-textarea">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                    fontSize: "13px",
                  }}
                >
                  Output
                </div>
                <Input.TextArea
                  type="text"
                  value={output}
                  readOnly
                  onChange={(e) => setInput(e.target.value)}
                  style={{
                    resize: "none",
                    width: "98%",
                    height: "100px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#FDFAF6",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CodeEditor;