const container = document.querySelector('#container');
const formEl = document.querySelector('form.weatherdata-form');
const API_KEY = process.env.WEATHER_API_KEY;

async function fetchWeather(e) {
    const form = e.target;
    const formData = new FormData(form);
    const zipCode = formData.get('zip-code');
    if (zipCode === '') return;
    e.preventDefault();
    const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode}&cnt=25&units=imperial&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json().then((data) => {
        filter(data);
        console.log(data);
    });
}

formEl.addEventListener('submit', fetchWeather);

filter = (data) => {
    // Get Third and Fourth Day
    const getThirdDay = (data.list[16].dt + data.city.timezone) * 1000;
    const thirdDay = new Date(getThirdDay).toLocaleDateString('en-US', {
        weekday: 'long',
    });
    const getFourthDay = (data.list[24].dt + data.city.timezone) * 1000;
    const fourthDay = new Date(getFourthDay).toLocaleDateString('en-US', {
        weekday: 'long',
    });

    // Sunrise
    const getSunrise = data.city.sunrise * 1000;
    const sunriseDate = new Date(getSunrise).toLocaleDateString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sunrise = sunriseDate.slice(-8);

    // Sunset
    const getSunset = data.city.sunset * 1000;
    const sunsetDate = new Date(getSunset).toLocaleDateString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sunset = sunsetDate.slice(-8);

    // Create display
    container.innerHTML = `
    <div class="location">
        <div>${data.city.name}, ${data.city.country}</div>
        <div>4-Day Forecast</div>
    </div>
    <div class="today-forecast">
        <div class="weather-container">
            <div class="date">Today</div>
            <img class="icon" src="imgs/${
                data.list[0].weather[0].main === 'Clouds'
                    ? 'clouds'
                    : data.list[0].weather[0].main === 'Rainy'
                    ? 'rainy'
                    : 'sunny'
            }.png" alt="weather icon" />
        </div>

        <div class="details-container">
            <div class="primary-details">
                <div class="current-temp">${Math.round(data.list[0].main.temp)}F
                </div>
                <div class="description">${data.list[0].weather[0].description}
                </div>
            </div>

            <div class="secondary-details">
                <div>
                    <h4>Min Temp</h4>
                <div>${Math.round(data.list[0].main.temp_min)}F</div>
                </div>
                <div>
                    <h4>Max Temp</h4>
                    <div>${Math.round(data.list[0].main.temp_max)}F</div>
                </div>
                <div>
                    <h4>Sunrise</h4>
                <div>${sunrise}</div>
                </div>
                <div>
                    <h4>Sunet</h4>
                    <div>${sunset}</div>
                </div>
                <div>
                    <h4>Humidity</h4>
                    <div>${data.list[0].main.humidity}%</div>
                </div>
                <div>
                    <h4>Wind Speed</h4>
                    <div>${Math.round(data.list[0].wind.speed)} mph</div>
                </div>
            </div>
        </div>
    </div>
    <div class="future-forecast">
        <div class="future-day">
            <div class="date">Tomorrow</div>
            <img class="icon" src="imgs/${
                data.list[8].weather[0].main === 'Clouds'
                    ? 'clouds'
                    : data.list[8].weather[0].main === 'Rainy'
                    ? 'rainy'
                    : 'sunny'
            }.png" alt="cloud" />
            <div class="description">${
                data.list[8].weather[0].description
            }</div>
            <div class="current-temp">${Math.round(
                data.list[8].main.temp
            )}F</div>
        </div>
        <div class="future-day">
            <div class="date">${thirdDay}</div>
            <img class="icon" src="imgs/${
                data.list[16].weather[0].main === 'Clouds'
                    ? 'clouds'
                    : data.list[16].weather[0].main === 'Rainy'
                    ? 'rainy'
                    : 'sunny'
            }.png" alt="cloud" />
            <div class="description">${
                data.list[16].weather[0].description
            }</div>
            <div class="current-temp">${Math.round(
                data.list[16].main.temp
            )}F</div>
        </div>
        <div class="future-day">
            <div class="date">${fourthDay}</div>
            <img class="icon" src="imgs/${
                data.list[24].weather[0].main === 'Clouds'
                    ? 'clouds'
                    : data.list[24].weather[0].main === 'Rainy'
                    ? 'rainy'
                    : 'sunny'
            }.png" alt="cloud" />
            <div class="description">${
                data.list[24].weather[0].description
            }</div>
            <div class="current-temp">${Math.round(
                data.list[24].main.temp
            )}F</div>
        </div>
    </div>
    `;
};

// TODO
// 1. Update icon colors
// 2. Put API key in dotenv
