import './style.css';
import { getWeather, getForecast } from './weather';

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.classList.remove('hidden');
    
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}">`;

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
}

async function handleWeatherSearch() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');
    const weatherInfo = document.getElementById('weatherInfo');
    const forecastInfo = document.getElementById('forecastInfo');
    
    if (!city) {
        errorDiv.textContent = 'Please enter a city name';
        errorDiv.classList.remove('hidden');
        return;
    }

    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    forecastInfo.classList.add('hidden');
    
    try {
        // Fetch both current weather and forecast
        const [weatherData, forecastData] = await Promise.all([
            getWeather(city),
            getForecast(city)
        ]);
        
        displayWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', handleWeatherSearch);

    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleWeatherSearch();
        }
    });
});

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    const forecastInfo = document.getElementById('forecastInfo');
    
    // Clear previous forecast
    forecastDiv.innerHTML = '';
    
    // Get unique dates from the forecast data
    const uniqueForecasts = [];
    const seen = new Set();
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!seen.has(date)) {
            seen.add(date);
            uniqueForecasts.push(item);
        }
    });

    // Take only the next 5 days
    uniqueForecasts.slice(1, 6).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-card';
        
        dayCard.innerHTML = `
            <div class="forecast-date">
                ${date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <img 
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                alt="${day.weather[0].description}"
            >
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
            <div class="forecast-desc">${day.weather[0].description}</div>
        `;
        
        forecastDiv.appendChild(dayCard);
    });
    
    forecastInfo.classList.remove('hidden');
}