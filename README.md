#  MarketTrack – Cryptocurrency Market Tracker

##  Project Description

MarketTrack is a responsive cryptocurrency market tracking web application built using HTML, CSS, and Vanilla JavaScript.

It uses the CoinGecko API to display live cryptocurrency market information. Users can search, sort, save their favourite coins, and view detailed information about individual cryptocurrencies.

The application also supports Dark Mode and Light Mode.

##  Features

1. **Market Overview** – Displays the top 20 cryptocurrencies initially.
2. **Live Market Data** – Fetches cryptocurrency data using the CoinGecko API.
3. **View More** – Loads 8 additional cryptocurrency cards with each click.
4. **Search** – Search coins by their name or symbol.
5. **Sorting** – Sort cryptocurrencies by:
   - Market capitalization (high to low and low to high)
   - Price (high to low and low to high)
   - 24-hour percentage change (high to low and low to high)
6. **Watchlist** – Add or remove favourite cryptocurrencies.
7. **Coin Details** – View price, market cap, trading volume, 24-hour high and low, supply information, and coin description.
8. **Dark and Light Mode** – Switch between two themes.
9. **Refresh Button** – Fetch updated market information.
10. **Responsive Design** – Works on desktop, tablet, and mobile devices.
11. **LocalStorage** – Saves watchlist coins and theme preferences.

##  Technologies Used

- HTML5 – Website structure
- Tailwind CSS – Styling and responsive design
- JavaScript – Application functionality
- Font Awesome – Icons
- CoinGecko API – Cryptocurrency market data
- LocalStorage – Saving user preferences
- Git and GitHub – Version control
- Vercel – Deployment

##  API Used

**CoinGecko API**

API Documentation: https://docs.coingecko.com/

Market Data Endpoint:

https://api.coingecko.com/api/v3/coins/markets

The API provides cryptocurrency information such as:

- Coin name and symbol
- Current price
- 24-hour price change
- Market capitalization
- Coin image
- Trading volume

The public demo endpoint is used in this project. API rate limits may apply.

##  Project Structure

market-tracker/
│
├── index.html
├── script.js
├── README.md
└── screenshots
    ├── light mode.png
    └── dark mode.png

##  How to Run the Project

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Install the Live Server extension.
4. Right-click on `index.html`.
5. Select **Open with Live Server**.
6. MarketTrack will open in your browser.

An active internet connection is required to fetch market data from the API.

##  Data Storage

LocalStorage is used to save:

- Favourite cryptocurrencies in the watchlist.
- Dark or Light Mode preference.

Saved information remains available after refreshing the page in the same browser.

##  Responsive Design

The application is designed to work on:

- Desktop computers
- Tablets
- Mobile phones

##  Important Note

Cryptocurrency prices are subject to frequent changes.

MarketTrack is an educational project developed for learning JavaScript, API integration, DOM manipulation, and LocalStorage.

It does not provide financial or investment advice.

## Author

**Pranjal Kumawat**

Project: JavaScript Mastery – Milestone 2

## License

This project is created for educational purposes.