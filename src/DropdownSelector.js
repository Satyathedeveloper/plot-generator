import React, { useState, useEffect } from 'react';

import './DropdownSelector.css';
const DropdownSelector = ({ columns = [], data = [], onSubmit }) => {
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [legend, setLegend] = useState('');
  const [filter, setFilter] = useState('');
  const [filterValues, setFilterValues] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  // Fetch unique values for the selected filter
  useEffect(() => {
    if (filter) {
      const uniqueValues = [...new Set(data.map(row => row[filter]))];
      setFilterValues(uniqueValues);
    } else {
      setFilterValues([]);
    }
  }, [filter,data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(xAxis, yAxis, legend, filter, filterValue);
  };

  return (
    <form onSubmit={handleSubmit} className="dropdown-form">
      <div className="dropdown-container">
        <label htmlFor="xAxis">X-Axis:</label>
        <select id="xAxis" value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
          <option value="">Select X-Axis</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      <div className="dropdown-container">
        <label htmlFor="yAxis">Y-Axis:</label>
        <select id="yAxis" value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
          <option value="">Select Y-Axis</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      <div className="dropdown-container">
        <label htmlFor="legend">Legend:</label>
        <select id="legend" value={legend} onChange={(e) => setLegend(e.target.value)}>
          <option value="">Select Legend</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      <div className="dropdown-container">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Select Filter</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      {filter && (
        <div className="dropdown-container">
          <label htmlFor="filterValue">Filter Value:</label>
          <select id="filterValue" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select Filter Value</option>
            {filterValues.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      )}
      <button type="submit" className="submit-button">Generate Plot</button>
    </form>
  );
};

export default DropdownSelector;
