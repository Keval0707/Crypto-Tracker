import React, { useState, useEffect } from 'react';
import './App.css';

function CryptoTracker() {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ 
    key: 'marketCap', 
    direction: 'descending' 
  });

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('/api/cryptocurrencies');
        const data = await response.json();
        setCryptocurrencies(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Sorting function
  const sortedCryptocurrencies = [...cryptocurrencies].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortConfig.key === 'price') {
      return sortConfig.direction === 'ascending'
        ? a.currentPrice - b.currentPrice
        : b.currentPrice - a.currentPrice;
    }

    return 0;
  });

  // Filtering function
  const filteredCryptocurrencies = sortedCryptocurrencies.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  return (
    <div className="crypto-tracker">
      <h1>Cryptocurrency Price Tracker</h1>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search cryptocurrencies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="crypto-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && 
                (sortConfig.direction === 'ascending' ? '▲' : '▼')}
            </th>
            <th>Symbol</th>
            <th onClick={() => handleSort('price')}>
              Current Price {sortConfig.key === 'price' && 
                (sortConfig.direction === 'ascending' ? '▲' : '▼')}
            </th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptocurrencies.map(crypto => (
            <tr key={crypto.symbol}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.currentPrice.toFixed(2)}</td>
              <td 
                style={{ 
                  color: crypto.priceChange24h >= 0 ? 'green' : 'red' 
                }}
              >
                {crypto.priceChange24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoTracker;