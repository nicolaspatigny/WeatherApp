export async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}