import React, { useState } from "react";
import './App.css'

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
        setExcelData(data.excelDataDifference[0].excelDifference);
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
      <table className="tables">
        <thead>
          <tr>
            {excelData.map((row, index) => (
              <th key={index}>{row.col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
          {excelData.map((row, index) => (
              <td key={index} className={row.val1 !== row.val2 ? "highlight-same" : "highlight-different"}>
                {row.val1}
              </td>
            ))}
          </tr>
        </tbody>
        <tbody>
          <tr>
          {excelData.map((row, index) => (
              <td key={index} className={row.val1 !== row.val2 ? "highlight-different" : "highlight-same"}>
                {row.val2}
              </td>
            ))}
          </tr>
        </tbody>
      </table>


    </div>

  );
}

export default App;
