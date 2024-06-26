import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchString, setSearchString] = useState('');
  const [keyFilters, setKeyFilters] = useState([{ key: '', match: { value: '' } }]);
  const [response, setResponse] = useState([]);

  const handleAddFilter = () => {
    setKeyFilters([...keyFilters, { key: '', match: { value: '' } }]);
  };

  const handleFilterChange = (index, field, value) => {
    const newKeyFilters = [...keyFilters];
    if (field === 'key') {
      newKeyFilters[index].key = value;
    } else {
      newKeyFilters[index].match.value = value;
    }
    setKeyFilters(newKeyFilters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      searchString,
      keyFilters,
    };
    console.log(payload)
    try {
      const res = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Ballerina Search</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Search String</label>
          <textarea
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            rows="4"
            cols="50"
          />
        </div>
        <div>
          <h2>Key Filters</h2>
          {keyFilters.map((filter, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Key"
                value={filter.key}
                onChange={(e) => handleFilterChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={filter.match.value}
                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddFilter}>Add Filter</button>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Response</h2>
        {response.map(item => (
          <div key={item.id} className="response-item">
            <h3>{item.payload.name}</h3>
            <h4>Score: {item.score}</h4>
            <h4>Score: {item.scoreCustom+0.7}</h4>
            <p><strong>Code:</strong> {item.payload.code}</p>
            <p><strong>Price:</strong> {item.payload.currency} {item.payload.current_price}</p>
            <p><strong>Description:</strong> {item.payload.description}</p>
            <p><strong>Shop Name:</strong> {item.payload.shop_name}</p>
            <p><strong>Status:</strong> {item.payload.status}</p>
            <p><strong>Link:</strong> <a href={item.payload.link} target="_blank" rel="noopener noreferrer">{item.payload.link}</a></p>
            <div className="images">
              {item.payload.images.map((image, index) => (
                <img key={index} src={image} alt={`product-${index}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
