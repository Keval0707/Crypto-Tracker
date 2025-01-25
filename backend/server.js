const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Updated Crypto Schema
const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceChange24h: { type: Number, required: true },
  marketCap: { type: Number },
  volume: { type: Number },
  circulatingSupply: { type: Number }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

// Connect to MongoDB using the provided connection string
mongoose.connect(process.env.MONGODB_URI, {
    // Removed deprecated options
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Updated API Route
app.get('/api/cryptocurrencies', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });

    const cryptoData = response.data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      circulatingSupply: coin.circulating_supply
    }));

    await Crypto.deleteMany({});
    await Crypto.insertMany(cryptoData);

    res.json(cryptoData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cryptocurrency data' });
  }
});

// Periodic data refresh
setInterval(async () => {
  try {
    // Fetch and update cryptocurrency data
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });
    const corsOptions = {
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));

    const cryptoData = response.data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h
    }));

    await Crypto.deleteMany({});
    await Crypto.insertMany(cryptoData);

    console.log('Cryptocurrency data updated');
  } catch (error) {
    console.error('Error updating cryptocurrency data', error);
  }
}, 5 * 60 * 1000); // Update every 5 minutes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for testing or further use
module.exports = app;