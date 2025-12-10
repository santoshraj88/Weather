# 🌤️ Weather App

A modern, feature-rich weather application that provides real-time weather information and 5-day forecasts for any city worldwide.

![Weather App](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- 🔍 **City Search** - Search weather for any city worldwide
- 📍 **Geolocation** - Get weather for your current location with one click
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- 📅 **5-Day Forecast** - View upcoming weather predictions
- 💾 **Recent Searches** - Quick access to previously searched cities
- 🎨 **Modern UI** - Beautiful gradient design with glass-morphism effects
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast & Lightweight** - Pure JavaScript, no frameworks needed
- 💿 **Local Storage** - Saves your preferences and recent searches

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenWeatherMap API key (free)

### Installation

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/santoshraj88/Weather.git
   cd Weather
   ```

2. **Get your API key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Go to "API keys" section
   - Copy your API key
   - **Note**: New API keys take 1-2 hours to activate

3. **Configure the API key**:
   - Open `script.js`
   - Find line 3 and replace with your API key:
   ```javascript
   apiKey: "YOUR_API_KEY_HERE",
   ```

4. **Run the app**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## 📖 Usage

### Search by City
1. Type a city name in the search box
2. Press Enter or click the Search button
3. View current weather and 5-day forecast

### Use Current Location
1. Click the "📍 Use My Location" button
2. Allow location access when prompted
3. Weather for your location will be displayed

### Toggle Temperature Units
- Click **°C** for Celsius
- Click **°F** for Fahrenheit
- Your preference is automatically saved

### Recent Searches
- Recently searched cities appear at the bottom
- Click any city name to quickly re-search

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with animations and gradients
- **JavaScript (ES6+)** - Async/await, fetch API, local storage
- **OpenWeatherMap API** - Weather data provider

## 📁 Project Structure

```
weather-app/
│
├── index.html          # Main HTML file
├── style.css           # Stylesheet with responsive design
├── script.js           # JavaScript logic and API calls
└── README.md          # Project documentation
```

## 🎨 Features Breakdown

### Weather Information Displayed
- Current temperature
- "Feels like" temperature
- Weather condition description
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Sunrise time
- Sunset time

### 5-Day Forecast
- Daily temperature predictions
- Weather condition icons
- Brief weather descriptions
- Responsive grid layout

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (Full 5-day forecast)
- **Tablet**: 481px - 768px (3-day forecast)
- **Mobile**: ≤ 480px (2-day forecast, stacked layout)

## 🔧 Configuration

### API Configuration
Edit `script.js` to customize:

```javascript
const CONFIG = {
    apiKey: "your_api_key_here",
    apiUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
    units: "metric" // or "imperial"
};
```

### Customization Options
- Change default units (metric/imperial)
- Modify color scheme in `style.css`
- Adjust number of recent searches (line 265 in script.js)
- Change forecast days displayed

## 🐛 Troubleshooting

### API Key Issues
- **Error 401**: API key is invalid or not activated yet (wait 1-2 hours)
- **Error 404**: City name not found (check spelling)
- **No Internet**: Check your network connection

### Geolocation Not Working
- Ensure HTTPS or localhost (geolocation requires secure context)
- Check browser location permissions
- Try allowing location access in browser settings

### Recent Searches Not Saving
- Check if browser allows localStorage
- Disable "private/incognito" mode
- Clear browser cache and try again

## 📄 API Usage

This app uses the free tier of OpenWeatherMap API:
- **60 calls/minute**
- **1,000,000 calls/month**
- No credit card required

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Hourly forecast
- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] UV index
- [ ] Weather maps
- [ ] Multiple location comparison
- [ ] Dark/Light theme toggle
- [ ] Weather history graphs
- [ ] Export weather data

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Santosh Raj - [@santoshraj88](https://github.com/santoshraj88)

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and emojis from Unicode Standard
- Gradient inspiration from [UI Gradients](https://uigradients.com/)

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- GitHub: [@santoshraj88](https://github.com/santoshraj88)

---

⭐ **Star this repo** if you found it helpful!

Made with ❤️ and ☕
