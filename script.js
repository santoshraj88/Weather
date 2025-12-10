// Weather App Configuration
const CONFIG = {
    apiKey: "fd48eac4535510470cc2256524cc78c2", // Get your free API key from: https://openweathermap.org/api
    apiUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
    units: "metric"
};

// DOM Elements
const elements = {
    cityInput: null,
    weatherResult: null,
    forecastResult: null,
    searchButton: null,
    recentSearches: null
};

// State management
const state = {
    currentCity: null,
    currentUnits: "metric",
    recentSearches: []
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    elements.cityInput = document.getElementById("city");
    elements.weatherResult = document.getElementById("weather-result");
    elements.forecastResult = document.getElementById("forecast-result");
    elements.searchButton = document.querySelector(".search-box button");
    elements.recentSearches = document.getElementById("recent-searches");
    
    // Load saved settings and searches
    loadSavedData();
    displayRecentSearches();
    
    // Enable Enter key search
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getWeather();
        }
    });
});

/**
 * Main function to fetch and display weather data
 */
async function getWeather() {
    const city = elements.cityInput.value.trim();
    
    // Validation
    if (!city) {
        showError("Please enter a city name");
        return;
    }

    if (CONFIG.apiKey === "YOUR_API_KEY") {
        showError("Please configure your API key in script.js");
        return;
    }

    // Show loading state
    setLoadingState(true);
    
    try {
        const weatherData = await fetchWeatherData(city);
        state.currentCity = city;
        addToRecentSearches(city);
        displayWeather(weatherData);
        await getForecast(city);
    } catch (error) {
        handleError(error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Get weather for current geolocation
 */
async function getLocationWeather() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser");
        return;
    }

    setLoadingState(true);
    elements.weatherResult.innerHTML = '<p class="loading-text">Getting your location...</p>';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const url = `${CONFIG.apiUrl}?lat=${latitude}&lon=${longitude}&appid=${CONFIG.apiKey}&units=${state.currentUnits}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.cod === 200) {
                    state.currentCity = data.name;
                    elements.cityInput.value = data.name;
                    displayWeather(data);
                    await getForecast(data.name);
                } else {
                    throw new Error("Unable to fetch weather for your location");
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoadingState(false);
            }
        },
        (error) => {
            setLoadingState(false);
            showError("Unable to retrieve your location. Please enable location services.");
        }
    );
}

/**
 * Toggle temperature units
 */
async function toggleUnit(unit) {
    if (unit === state.currentUnits) return;
    
    state.currentUnits = unit;
    CONFIG.units = unit;
    
    // Update UI
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    
    // Refresh weather if city is selected
    if (state.currentCity) {
        setLoadingState(true);
        try {
            const weatherData = await fetchWeatherData(state.currentCity);
            displayWeather(weatherData);
            await getForecast(state.currentCity);
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingState(false);
        }
    }
    
    saveSettings();
}

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    const url = `${CONFIG.apiUrl}?q=${encodeURIComponent(city)}&appid=${CONFIG.apiKey}&units=${state.currentUnits}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
        throw new Error("City not found. Please check the spelling and try again.");
    }

    if (data.cod !== 200) {
        throw new Error(data.message || "Failed to fetch weather data");
    }

    return data;
}

/**
 * Fetch 5-day weather forecast
 * @param {string} city - City name
 */
async function getForecast(city) {
    try {
        const url = `${CONFIG.forecastUrl}?q=${encodeURIComponent(city)}&appid=${CONFIG.apiKey}&units=${state.currentUnits}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "200") {
            displayForecast(data.list);
        }
    } catch (error) {
        console.error("Forecast fetch error:", error);
        // Don't show error to user, just skip forecast
    }
}

/**
 * Display 5-day forecast
 * @param {Array} forecastList - Forecast data array
 */
function displayForecast(forecastList) {
    // Get one forecast per day at noon
    const dailyForecasts = forecastList.filter(item => 
        item.dt_txt.includes("12:00:00")
    ).slice(0, 5);

    const unit = state.currentUnits === "metric" ? "°C" : "°F";

    const forecastHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = getWeatherIcon(day.weather[0].id);

        return `
            <div class="forecast-day">
                <div class="forecast-day-name">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${temp}${unit}</div>
                <div class="forecast-desc">${capitalizeWords(day.weather[0].description)}</div>
            </div>
        `;
    }).join('');

    elements.forecastResult.innerHTML = `
        <div class="forecast-container fade-in">
            <h3>5-Day Forecast</h3>
            <div class="forecast-grid">
                ${forecastHTML}
            </div>
        </div>
    `;
}

/**
 * Display weather data in the UI
 * @param {Object} data - Weather data from API
 */
function displayWeather(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const weatherIcon = getWeatherIcon(data.weather[0].id);
    const condition = capitalizeWords(data.weather[0].description);
    const unit = state.currentUnits === "metric" ? "°C" : "°F";
    const windUnit = state.currentUnits === "metric" ? "m/s" : "mph";
    
    // Get sunrise and sunset
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    elements.weatherResult.innerHTML = `
        <div class="weather-details fade-in">
            <div class="weather-icon">${weatherIcon}</div>
            <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
            <div class="temperature">${temp}${unit}</div>
            <p class="condition">${condition}</p>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">${feelsLike}${unit}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${data.main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${data.wind.speed} ${windUnit}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${data.main.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunrise</span>
                    <span class="detail-value">🌅 ${sunrise}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunset</span>
                    <span class="detail-value">🌇 ${sunset}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get appropriate weather icon based on weather condition code
 * @param {number} code - Weather condition code
 * @returns {string} Weather icon
 */
function getWeatherIcon(code) {
    if (code >= 200 && code < 300) return "⛈️";  // Thunderstorm
    if (code >= 300 && code < 500) return "🌧️";  // Drizzle
    if (code >= 500 && code < 600) return "🌧️";  // Rain
    if (code >= 600 && code < 700) return "❄️";  // Snow
    if (code >= 700 && code < 800) return "🌫️";  // Atmosphere
    if (code === 800) return "☀️";               // Clear
    if (code > 800) return "☁️";                 // Clouds
    return "🌡️";
}

/**
 * Display error message to user
 * @param {string} message - Error message
 */
function showError(message) {
    elements.weatherResult.innerHTML = `
        <div class="error-message fade-in">
            <span class="error-icon">⚠️</span>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 */
function handleError(error) {
    console.error("Weather fetch error:", error);
    
    let message = "Unable to fetch weather data. Please try again.";
    
    if (error.message.includes("City not found")) {
        message = error.message;
    } else if (!navigator.onLine) {
        message = "No internet connection. Please check your network.";
    }
    
    showError(message);
}

/**
 * Toggle loading state
 * @param {boolean} isLoading - Loading state
 */
function setLoadingState(isLoading) {
    if (elements.searchButton) {
        elements.searchButton.disabled = isLoading;
        elements.searchButton.classList.toggle('loading', isLoading);
    }
    
    if (elements.cityInput) {
        elements.cityInput.disabled = isLoading;
    }
}

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalizeWords(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

/**
 * Add city to recent searches
 * @param {string} city - City name
 */
function addToRecentSearches(city) {
    // Remove if already exists
    state.recentSearches = state.recentSearches.filter(c => 
        c.toLowerCase() !== city.toLowerCase()
    );
    
    // Add to beginning
    state.recentSearches.unshift(city);
    
    // Keep only last 5
    if (state.recentSearches.length > 5) {
        state.recentSearches = state.recentSearches.slice(0, 5);
    }
    
    saveSearches();
    displayRecentSearches();
}

/**
 * Display recent searches
 */
function displayRecentSearches() {
    if (state.recentSearches.length === 0) {
        elements.recentSearches.innerHTML = '';
        return;
    }

    const searchesHTML = state.recentSearches.map(city => `
        <button class="recent-city" onclick="searchRecent('${city}')">
            ${city}
        </button>
    `).join('');

    elements.recentSearches.innerHTML = `
        <div class="recent-container fade-in">
            <h4>Recent Searches</h4>
            <div class="recent-cities">
                ${searchesHTML}
            </div>
        </div>
    `;
}

/**
 * Search from recent searches
 * @param {string} city - City name
 */
function searchRecent(city) {
    elements.cityInput.value = city;
    getWeather();
}

/**
 * Save searches to localStorage
 */
function saveSearches() {
    try {
        localStorage.setItem('weatherAppSearches', JSON.stringify(state.recentSearches));
    } catch (error) {
        console.error('Failed to save searches:', error);
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        localStorage.setItem('weatherAppUnits', state.currentUnits);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

/**
 * Load saved data from localStorage
 */
function loadSavedData() {
    try {
        // Load searches
        const savedSearches = localStorage.getItem('weatherAppSearches');
        if (savedSearches) {
            state.recentSearches = JSON.parse(savedSearches);
        }
        
        // Load units preference
        const savedUnits = localStorage.getItem('weatherAppUnits');
        if (savedUnits) {
            state.currentUnits = savedUnits;
            CONFIG.units = savedUnits;
            
            // Update UI
            document.querySelectorAll('.unit-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.unit === savedUnits);
            });
        }
    } catch (error) {
        console.error('Failed to load saved data:', error);
    }
}
