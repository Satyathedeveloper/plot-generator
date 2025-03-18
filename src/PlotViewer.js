import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DropdownSelector from './DropdownSelector';
import './PlotViewer.css';

const PlotViewer = () => {
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [jsonDataVal, setJsonDataVal] = useState([]); // State to store JSON data
  const [tableName, setTableName] = useState('');




  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var jsonData = XLSX.utils.sheet_to_json(worksheet);


      jsonData = jsonData.map(row => {
        if (row['Billing Month Year']) {
          row['Billing Month Year'] = new Date(Math.round(((row['Billing Month Year']) - 25569) * 86400 * 1000))
        }

        if (row['Approved Date']) {
          if (typeof row['Approved Date'] === 'string') {
            if (row['Approved Date'] === "-") {
              row['Approved Date'] = "-"
              return row;
            }
            else {
              const moment = require('moment');
              const dateString = row['Approved Date'];
              row['Approved Date'] = moment(dateString, "DD-MM-YYYY").toDate();
              const timeDifference = row['Approved Date'] - new Date();
              const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
              console.log(daysDifference);
              row['Aging'] = daysDifference;
              return row;
            }
          }
        }
        return row;
      });


      console.log(jsonData);
      setLoading(true);

      try {
        // Set columns for dropdown selector
        const columns = Object.keys(jsonData[0]);
        console.log(jsonData);
        setColumns(columns);

        // Set the JSON data to state
        setJsonDataVal(jsonData);
      } catch (error) {
        setError(error.response ? error.response.data.error : error.message);
        setHtmlContent('');
      } finally {
        setLoading(false);
      }

      event.target.value = null;
    };
    reader.readAsArrayBuffer(file);
  }, []);




  const handleTableNameSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4200/database/fetch', { tableName });
      const data = response.data;

      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        setColumns(columns);
        setJsonDataVal(data);
      }
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
      setHtmlContent('');
    } finally {
      setLoading(false);
    }
  };





  const handleHomeButtonClick = () => {
    setHtmlContent('');
  };






  
  const handleDropdownSubmit = async (xAxis, yAxis, legend, filter, filterValue) => {
    setLoading(true);
  
    try {
      const filteredData = jsonDataVal.filter(item => {
        return !filter || item[filter] === filterValue;
      }).map(item => {
        return {
          [xAxis]: item[xAxis],
          [yAxis]: item[yAxis],
          ...(legend ? { [legend]: item[legend] } : {})
        };
      });





      const response = await axios.post('http://localhost:4200/plot/generate', {
        data: filteredData,
        xAxis,
        yAxis,
        legend,
        filter,
        filterValue,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const htmlWithScripts = response.data;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlWithScripts, 'text/html');
      const content = doc.body.innerHTML;
      const scripts = Array.from(doc.querySelectorAll('script')).map(script => script.textContent || '');
  
      setHtmlContent(content);
      setScripts(scripts);
      setError(null);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
      setHtmlContent('');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    scripts.forEach(scriptContent => {
      if (scriptContent) {
        const script = document.createElement('script');
        script.text = scriptContent;
        document.body.appendChild(script);
        document.body.removeChild(script);
      }
    });
  }, [scripts]);

  return (
    <div>
      <button onClick={handleHomeButtonClick} className="home-button">Home</button>
      <div className='filecon'>
        <h3>File Upload</h3>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="input-file"
        />
        <h3>or Enter Table Name</h3>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Enter Table Name"
          className="input-text"
        />
        <button onClick={handleTableNameSubmit} className="submit-button">Fetch Table Data</button>
      </div>
      {columns.length > 0 && (
        <DropdownSelector columns={columns} data={jsonDataVal} onSubmit={handleDropdownSubmit} />
      )}
      {loading && <p className="loading-message">Loading...</p>}
      <div className="plot-container" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
};


export default PlotViewer;
