import { useState } from "react";

function App() {
  const [demand, setDemand] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://flowchain.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demand: Number(demand) }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Backend not reachable");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AI Supply Chain Predictor</h1>

      <input
        type="number"
        placeholder="Enter demand"
        value={demand}
        onChange={(e) => setDemand(e.target.value)}
      />

      <br /><br />

      <button onClick={predict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      <br /><br />

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
