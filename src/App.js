import React, { useState } from "react";

function App() {

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const uploadFiles = async () => {

    if (files.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const data = await response.json();

      setResults(data.leaderboard);

    } catch (error) {

      console.log(error);
      alert("Upload Failed");

    }

    setLoading(false);
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          fontSize: "60px",
          marginBottom: "10px",
        }}
      >
        HackJudge AI
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "50px",
          fontSize: "20px",
        }}
      >
        AI Powered Hackathon PPT & PDF Screening System
      </p>

      <div
        style={{
          background: "#1e293b",
          padding: "35px",
          borderRadius: "25px",
          maxWidth: "700px",
          margin: "auto",
          textAlign: "center",
          marginBottom: "60px",
        }}
      >

        <input
          type="file"
          multiple
          accept=".ppt,.pptx,.pdf,application/pdf"
          onChange={(e) => setFiles(e.target.files)}
          style={{
            marginBottom: "20px",
            color: "white",
          }}
        />

        <br />

        <button
          onClick={uploadFiles}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "16px 35px",
            borderRadius: "14px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Evaluate All Files
        </button>

      </div>

      {
        loading &&
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          AI is evaluating projects...
        </h2>
      }

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "30px",
        }}
      >

        {
          results.map((item, index) => {

            const innovation = item.evaluation?.innovation || 0;
            const feasibility = item.evaluation?.feasibility || 0;
            const technical = item.evaluation?.technical_depth || 0;
            const market = item.evaluation?.market_potential || 0;
            const presentation = item.evaluation?.presentation || 0;

            return (

              <div
                key={index}
                style={{
                  background: "#1e293b",
                  borderRadius: "25px",
                  padding: "25px",
                  boxShadow: "0px 0px 20px rgba(0,0,0,0.4)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >

                  <h2>
                    Rank #{index + 1}
                  </h2>

                  <div
                    style={{
                      background:
                        item.score >= 70
                          ? "#16a34a"
                          : "#dc2626",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.score >= 70 ? "SELECTED" : "REJECTED"}
                  </div>

                </div>

                <h3
                  style={{
                    color: "#93c5fd",
                    marginTop: "15px",
                    wordBreak: "break-word",
                  }}
                >
                  {item.filename}
                </h3>

                <h1
                  style={{
                    fontSize: "55px",
                    marginTop: "10px",
                    marginBottom: "30px",
                  }}
                >
                  {item.score}/100
                </h1>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "end",
                    height: "250px",
                    gap: "12px",
                  }}
                >

                  {
                    [
                      {
                        label: "Innovation",
                        value: innovation,
                      },
                      {
                        label: "Feasibility",
                        value: feasibility,
                      },
                      {
                        label: "Technical",
                        value: technical,
                      },
                      {
                        label: "Market",
                        value: market,
                      },
                      {
                        label: "Presentation",
                        value: presentation,
                      },
                    ].map((bar, i) => (

                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >

                        <div
                          style={{
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#60a5fa",
                          }}
                        >
                          {bar.value}/20
                        </div>

                        <div
                          style={{
                            width: "50px",
                            height: `${bar.value * 10}px`,
                            background:
                              "linear-gradient(to top, #2563eb, #60a5fa)",
                            borderRadius: "14px 14px 0px 0px",
                            transition: "0.5s",
                          }}
                        />

                        <div
                          style={{
                            marginTop: "12px",
                            fontSize: "12px",
                            textAlign: "center",
                            color: "#cbd5e1",
                          }}
                        >
                          {bar.label}
                        </div>

                      </div>

                    ))
                  }

                </div>

                <button
                  onClick={() =>
                    setSelectedEvaluation(item.evaluation)
                  }
                  style={{
                    marginTop: "35px",
                    width: "100%",
                    padding: "15px",
                    border: "none",
                    borderRadius: "14px",
                    background: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  Detailed Evaluation
                </button>

              </div>

            );
          })
        }

      </div>

      {
        selectedEvaluation &&
        <div
          style={{
            marginTop: "60px",
            background: "#1e293b",
            padding: "35px",
            borderRadius: "25px",
            lineHeight: "1.9",
            fontSize: "16px",
          }}
        >

          <h1
            style={{
              marginBottom: "25px",
            }}
          >
            Detailed AI Evaluation
          </h1>

          <p>
            <strong>Innovation:</strong> {selectedEvaluation.innovation}/20
          </p>

          <p>
            <strong>Feasibility:</strong> {selectedEvaluation.feasibility}/20
          </p>

          <p>
            <strong>Technical Depth:</strong> {selectedEvaluation.technical_depth}/20
          </p>

          <p>
            <strong>Market Potential:</strong> {selectedEvaluation.market_potential}/20
          </p>

          <p>
            <strong>Presentation:</strong> {selectedEvaluation.presentation}/20
          </p>

          <br />

          <h2>Strengths</h2>

          <ul>
            {
              selectedEvaluation.strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            }
          </ul>

          <h2>Weaknesses</h2>

          <ul>
            {
              selectedEvaluation.weaknesses?.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            }
          </ul>

          <h2>Final Verdict</h2>

          <p>
            {selectedEvaluation.verdict}
          </p>

        </div>
      }

    </div>
  );
}

export default App;