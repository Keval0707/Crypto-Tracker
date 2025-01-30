# Crypto Tracker

A simple cryptocurrency tracking application that fetches real-time data from the CoinGecko API and displays it in a user-friendly interface. This project allows users to view the current prices, market cap, volume, and other relevant information for various cryptocurrencies.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Real-Time Prices**: View up-to-date prices for various cryptocurrencies.
- **Market Data**: Display market cap, trading volume, and price changes over different timeframes.
- **Responsive Design**: Optimized for both mobile and desktop users.
- **API Integration**: Fetch data seamlessly from the CoinGecko API.

---

## Technologies Used

### Frontend:
- React.js
- CSS (for styling)

### Backend:
- Node.js
- Express.js
- Mongoose

### Database:
- MongoDB

### API:
- [CoinGecko API](https://www.coingecko.com/en/api)

---

## Installation

To get a local copy of this project up and running, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/yourusername/crypto-tracker.git
```

### Navigate to the Project Directory

```bash
cd crypto-tracker
```

### Install Dependencies

1. **Backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configure Environment Variables

1. Navigate to the `backend` directory.
2. Create a `.env` file and add the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

---

## Usage

### Start the Application

1. **Backend Server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Frontend Application:**
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## API

This project uses the CoinGecko API to fetch cryptocurrency data. Below is the main endpoint utilized:

- **Get Market Data:**
  Endpoint: `https://api.coingecko.com/api/v3/coins/markets`
  Parameters:
  - `vs_currency`: The currency to show the data in (e.g., USD).
  - `ids`: Specific cryptocurrency IDs (comma-separated).
  - `order`: Sorting preference.

For full API documentation, visit the [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation).

---

## Project Structure

```
crypto-tracker/
|-- backend/
|   |-- models/       # MongoDB schema and models
|   |-- routes/       # API routes
|   |-- server.js     # Main server file
|-- frontend/
|   |-- src/
|       |-- components/  # React components
|       |-- pages/       # Application pages
|       |-- App.js       # Root component
|-- .gitignore
|-- README.md
```

---

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your fork:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on the main repository.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

- **Author**: Keval Amitkumar Dhabalia
- **Email**: dhabaliakeval@gmail.com
