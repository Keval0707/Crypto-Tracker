import React, { useState, useEffect, useCallback } from 'react';

// Inline CSS
const styles = `
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #08050b, #1a1a2e);
  color: #ffffff;
  margin: 0;
  padding: 20px;
}

.crypto-tracker {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 15px;
  max-width: 1100px;
  margin: 20px auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.crypto-tracker h1 {
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  padding: 20px;
  text-align: center;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  border-radius: 10px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 5px;
}

.crypto-table, .portfolio-section table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.crypto-table th, .portfolio-section table th {
  background: rgba(78, 84, 200, 0.2);
  color: #8f94fb;
  padding: 15px;
  text-align: left;
}

.crypto-table tr, .portfolio-section table tr {
  background: rgba(30, 30, 60, 0.5);
  transition: all 0.3s ease;
}

.crypto-table td, .portfolio-section table td {
  padding: 15px;
  color: #e0e0e0;
}

button {
  background: #4e54c8;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #6a70f5;
}

.portfolio-section {
  margin-top: 30px;
  background: rgba(30, 30, 60, 0.5);
  padding: 20px;
  border-radius: 10px;
}
`;

function CryptoTracker() {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  // Add style to document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Fetch Cryptocurrency Data
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

  // Portfolio Management
  const addToPortfolio = (crypto, amount) => {
    setPortfolio(prev => ({
      ...prev,
      [crypto.symbol]: {
        ...crypto,
        amount: (prev[crypto.symbol]?.amount || 0) + amount
      }
    }));
  };

  // Portfolio Value Calculation
  const calculatePortfolioValue = () => {
    return Object.values(portfolio).reduce((total, crypto) => 
      total + (crypto.currentPrice * crypto.amount), 0);
  };

  // Price Change Alerts
  const checkPriceAlerts = useCallback(() => {
    cryptocurrencies.forEach(crypto => {
      if (crypto.priceChange24h > 10) {
        alert(`🚨 ${crypto.name} price increased by ${crypto.priceChange24h.toFixed(2)}%!`);
      }
      if (crypto.priceChange24h < -10) {
        alert(`⚠️ ${crypto.name} price dropped by ${Math.abs(crypto.priceChange24h).toFixed(2)}%!`);
      }
    });
  }, [cryptocurrencies]);

  useEffect(() => {
    checkPriceAlerts();
  }, [cryptocurrencies, checkPriceAlerts]);

  return (
    <div className="crypto-tracker">
      <h1>Ultimate Crypto Tracker</h1>
      
      {/* Search and Filters */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search cryptocurrencies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Cryptocurrency List */}
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies
            .filter(crypto => 
              crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(crypto => (
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
                <td>
                  <button onClick={() => {
                    const amount = parseFloat(prompt(`How many ${crypto.symbol} do you want to add?`) || 0);
                    if (amount > 0) addToPortfolio(crypto, amount);
                  }}>
                    Add to Portfolio
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Portfolio Section */}
      <div className="portfolio-section">
        <h2>My Portfolio</h2>
        <p>Total Portfolio Value: ${calculatePortfolioValue().toFixed(2)}</p>
        <table>
          <thead>
            <tr>
              <th>Crypto</th>
              <th>Amount</th>
              <th>Current Value</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(portfolio).map(crypto => (
              <tr key={crypto.symbol}>
                <td>{crypto.name}</td>
                <td>{crypto.amount}</td>
                <td>${(crypto.amount * crypto.currentPrice).toFixed(2)}</td>
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
    </div>
  );
}

export default CryptoTracker;