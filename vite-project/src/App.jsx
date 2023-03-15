import React, { useState } from "react";
import "./App.css";

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [filesUploaded, setFilesUploaded] = useState(false);

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
    if (file2) {
      setFilesUploaded(true);
    }
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
    if (file1) {
      setFilesUploaded(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    fetch("http://localhost:3000/compare-excel", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setExcelData(data);
        console.log("data", data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" id="file1" onChange={handleFile1Change} />
        <input type="file" id="file2" onChange={handleFile2Change} />
        {filesUploaded && <button type="submit">Find Difference</button>}
      </form>

      <div className="table-container">
        <table className="tables">
          <thead>
            <tr>
              {excelData[0]?.rowDifferences?.["1"]?.map((item) => (
                <th>{item.col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData[0]?.rowDifferences &&
              Object.keys(excelData[0].rowDifferences).map((key) => {
                return (
                  <tr>
                    {excelData[0].rowDifferences[key].map((item) => {
                      // Split the cell values into tokens
                      const tokens1 = item.val1.toString().split(/(\W+)/);
                      const tokens2 = item.val2.toString().split(/(\W+)/);

                      // Find the differences between the two sets of tokens
                      const differences = [];
                      for (let i = 0; i < Math.max(tokens1.length, tokens2.length); i++) {
                        if (tokens1[i] !== tokens2[i]) {
                          differences.push(i);
                        }
                      }

                      // Render each token, highlighting the differences
                      return (
                        <td>
                          {tokens1.map((token, index) => {
                            const isDifferent = differences.includes(index);
                            return (
                              <span className={isDifferent ? "different" : ""}>
                                {token}
                              </span>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <table className="tables">
          <thead>
            <tr>
              {excelData[0]?.rowDifferences?.["1"]?.map((item) => (
                <th>{item.col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {excelData[0]?.rowDifferences &&
              Object.keys(excelData[0].rowDifferences).map((key) => {
                return (
                  <tr>
                    {excelData[0].rowDifferences[key].map((item) => {
                      // Split the cell values into tokens
                      const tokens1 = item.val2.toString().split(/(\W+)/);
                      const tokens2 = item.val1.toString().split(/(\W+)/);

                      // Find the differences between the two sets of tokens
                      const differences = [];
                      for (let i = 0; i < Math.max(tokens1.length, tokens2.length); i++) {
                        if (tokens1[i] !== tokens2[i]) {
                          differences.push(i);
                        }
                      }
                      // Render each token, highlighting the differences
                      return (
                        <td>
                          {tokens1.map((token, index) => {
                            const isDifferent = differences.includes(index);
                            return (
                              <span className={isDifferent ? "different" : ""}>
                                {token}
                              </span>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>

        </table>


      </div>

    </div>
  );
}

export default App;
