// WeatherPulse Pro - Advanced Weather Intelligence
class WeatherDashboard {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
        this.airQualityUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';
        this.archiveUrl = 'https://archive-api.open-meteo.com/v1/archive';
        this.floodUrl = 'https://flood-api.open-meteo.com/v1/flood';
        this.currentUnit = 'metric'; // metric for Celsius, imperial for Fahrenheit
        this.currentCity = '';
        this.currentCoords = { lat: null, lon: null };
        this.currentForecastDays = 16;
        this.currentWeatherModel = 'auto';
        this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadDefaultLocation();
        this.loadFavorites();
    }

    initializeElements() {
        // Search elements
        this.citySearch = document.getElementById('citySearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.favoritesBtn = document.getElementById('favoritesBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Forecast controls
        this.forecastDays = document.getElementById('forecastDays');
        this.weatherModel = document.getElementById('weatherModel');
        this.updateForecastBtn = document.getElementById('updateForecast');
        this.forecastTitle = document.getElementById('forecastTitle');
        
        // Pressure level controls
        this.pressureLevel = document.getElementById('pressureLevel');
        this.pressureTemp = document.getElementById('pressureTemp');
        this.pressureHumidity = document.getElementById('pressureHumidity');
        this.pressureWindSpeed = document.getElementById('pressureWindSpeed');
        this.pressureWindDirection = document.getElementById('pressureWindDirection');
        this.pressureCloudCover = document.getElementById('pressureCloudCover');
        this.pressureGeopotential = document.getElementById('pressureGeopotential');
        
        // 15-minutely controls
        this.minutelyVariable = document.getElementById('minutelyVariable');
        this.minutelyHours = document.getElementById('minutelyHours');
        this.minutelySmoothing = document.getElementById('minutelySmoothing');
        this.updateMinutelyBtn = document.getElementById('updateMinutely');
        this.minutelyChart = document.getElementById('minutelyChart');
        this.exportMinutelyBtn = document.getElementById('exportMinutelyData');
        
        // Minutely summary elements
        this.minutelyCurrent = document.getElementById('minutelyCurrent');
        this.minutelyPeak = document.getElementById('minutelyPeak');
        this.minutelyMin = document.getElementById('minutelyMin');
        this.minutelyAvg = document.getElementById('minutelyAvg');
        
        // Weather maps controls
        this.mapType = document.getElementById('mapType');
        this.mapAnimation = document.getElementById('mapAnimation');
        this.mapOverlay = document.getElementById('mapOverlay');
        this.updateMapBtn = document.getElementById('updateMap');
        this.fullscreenMapBtn = document.getElementById('fullscreenMap');
        this.weatherMapCanvas = document.getElementById('weatherMapCanvas');
        this.mapViewer = document.getElementById('mapViewer');
        this.mapLegend = document.getElementById('mapLegend');
        this.legendItems = document.getElementById('legendItems');
        
        // Weather animations controls
        this.animationType = document.getElementById('animationType');
        this.animationIntensity = document.getElementById('animationIntensity');
        this.intensityValue = document.getElementById('intensityValue');
        this.backgroundTheme = document.getElementById('backgroundTheme');
        this.autoAnimations = document.getElementById('autoAnimations');
        this.applyAnimationsBtn = document.getElementById('applyAnimations');
        this.resetAnimationsBtn = document.getElementById('resetAnimations');
        this.animationCanvas = document.getElementById('animationCanvas');
        
        // Ensemble weather controls
        this.ensembleModels = document.getElementById('ensembleModels');
        this.ensembleVariable = document.getElementById('ensembleVariable');
        this.ensembleForecast = document.getElementById('ensembleForecast');
        this.ensembleSpread = document.getElementById('ensembleSpread');
        this.ensembleMean = document.getElementById('ensembleMean');
        this.compareEnsembleBtn = document.getElementById('compareEnsemble');
        this.exportEnsembleBtn = document.getElementById('exportEnsembleData');
        this.ensembleChart = document.getElementById('ensembleChart');
        
        // Ensemble summary elements
        this.modelConsensus = document.getElementById('modelConsensus');
        this.highUncertainty = document.getElementById('highUncertainty');
        this.mostLikely = document.getElementById('mostLikely');
        
        // Historical weather controls
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        this.historicalModel = document.getElementById('historicalModel');
        this.historicalVariables = document.getElementById('historicalVariables');
        this.getHistoricalDataBtn = document.getElementById('getHistoricalData');
        this.historicalChart = document.getElementById('historicalChart');
        
        // Historical summary elements
        this.historicalAvgTemp = document.getElementById('historicalAvgTemp');
        this.historicalMaxTemp = document.getElementById('historicalMaxTemp');
        this.historicalMinTemp = document.getElementById('historicalMinTemp');
        this.historicalTotalPrecip = document.getElementById('historicalTotalPrecip');
        
        // Enhanced historical elements
        this.historicalInterval = document.getElementById('historicalInterval');
        this.historicalAggregation = document.getElementById('historicalAggregation');
        this.historicalAnomaly = document.getElementById('historicalAnomaly');
        this.historicalCompare = document.getElementById('historicalCompare');
        this.exportHistoricalBtn = document.getElementById('exportHistoricalData');
        this.historicalAvgWind = document.getElementById('historicalAvgWind');
        this.historicalAvgPressure = document.getElementById('historicalAvgPressure');
        this.historicalAvgHumidity = document.getElementById('historicalAvgHumidity');
        this.historicalTotalRadiation = document.getElementById('historicalTotalRadiation');
        this.tempExtremes = document.getElementById('tempExtremes');
        this.precipEvents = document.getElementById('precipEvents');
        this.windEvents = document.getElementById('windEvents');
        
        // Chart tabs
        this.chartTabs = document.querySelectorAll('.tab-btn');
        this.currentChartType = 'line';
        
        // Flood monitoring elements
        this.floodModel = document.getElementById('floodModel');
        this.floodForecastDays = document.getElementById('floodForecastDays');
        this.floodVariables = document.getElementById('floodVariables');
        this.floodEnsemble = document.getElementById('floodEnsemble');
        this.getFloodDataBtn = document.getElementById('getFloodData');
        this.floodChart = document.getElementById('floodChart');
        this.currentDischarge = document.getElementById('currentDischarge');
        this.meanDischarge = document.getElementById('meanDischarge');
        this.maxDischarge = document.getElementById('maxDischarge');
        this.minDischarge = document.getElementById('minDischarge');
        
        // Enhanced flood elements
        this.floodAlertThreshold = document.getElementById('floodAlertThreshold');
        this.floodAlerts = document.getElementById('floodAlerts');
        this.floodCompare = document.getElementById('floodCompare');
        this.exportFloodBtn = document.getElementById('exportFloodData');
        this.floodRiskLevel = document.getElementById('floodRiskLevel');
        this.floodAlertStatus = document.getElementById('floodAlertStatus');
        this.risingWater = document.getElementById('risingWater');
        this.highFlowEvents = document.getElementById('highFlowEvents');
        this.flowAnomalies = document.getElementById('flowAnomalies');
        
        // Display elements
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.weatherContent = document.getElementById('weatherContent');
        
        // Current weather elements
        this.cityName = document.getElementById('cityName');
        this.countryName = document.getElementById('countryName');
        this.currentDate = document.getElementById('currentDate');
        this.temperature = document.getElementById('temperature');
        this.unitToggle = document.getElementById('unitToggle');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        
        // Weather details
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.uvIndex = document.getElementById('uvIndex');
        this.visibility = document.getElementById('visibility');
        this.cloudiness = document.getElementById('cloudiness');
        
        // Advanced metrics
        this.windDirection = document.getElementById('windDirection');
        this.dewPoint = document.getElementById('dewPoint');
        this.precipitation = document.getElementById('precipitation');
        this.sunrise = document.getElementById('sunrise');
        this.sunset = document.getElementById('sunset');
        this.soilMoisture = document.getElementById('soilMoisture');
        this.evapotranspiration = document.getElementById('evapotranspiration');
        // Note: elevation element removed from HTML to fix null error
        
        // Air quality
        this.aqiNumber = document.getElementById('aqiNumber');
        this.aqiLevel = document.getElementById('aqiLevel');
        
        // Alerts and favorites
        this.alertsContainer = document.getElementById('alertsContainer');
        this.favoritesList = document.getElementById('favoritesList');
        
        // Charts
        this.tempChart = document.getElementById('tempChart');
        this.precipChart = document.getElementById('precipChart');
        
        // Forecast
        this.forecastCards = document.getElementById('forecastCards');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.favoritesBtn.addEventListener('click', () => this.toggleFavorites());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.unitToggle.addEventListener('click', () => this.toggleUnits());
        
        // Forecast control events
        this.forecastDays.addEventListener('change', () => this.updateForecastSettings());
        this.weatherModel.addEventListener('change', () => this.updateForecastSettings());
        this.updateForecastBtn.addEventListener('click', () => this.updateForecastSettings());
        
        // Pressure level events
        this.pressureLevel.addEventListener('change', () => this.updatePressureLevel());
        
        // 15-minutely events
        this.minutelyVariable.addEventListener('change', () => this.updateMinutelyChart());
        this.minutelyHours.addEventListener('change', () => this.updateMinutelyChart());
        this.minutelySmoothing.addEventListener('change', () => this.updateMinutelyChart());
        this.updateMinutelyBtn.addEventListener('click', () => this.updateMinutelyChart());
        this.exportMinutelyBtn.addEventListener('click', () => this.exportMinutelyData());
        
        // Weather maps events
        this.mapType.addEventListener('change', () => this.updateWeatherMap());
        this.mapAnimation.addEventListener('change', () => this.updateWeatherMap());
        this.mapOverlay.addEventListener('change', () => this.updateWeatherMap());
        this.updateMapBtn.addEventListener('click', () => this.updateWeatherMap());
        this.fullscreenMapBtn.addEventListener('click', () => this.toggleMapFullscreen());
        
        // Weather animations events
        this.animationType.addEventListener('change', () => this.updateAnimationPreview());
        this.animationIntensity.addEventListener('input', () => this.updateIntensityDisplay());
        this.backgroundTheme.addEventListener('change', () => this.updateBackgroundTheme());
        this.autoAnimations.addEventListener('change', () => this.toggleAutoAnimations());
        this.applyAnimationsBtn.addEventListener('click', () => this.applyWeatherAnimations());
        this.resetAnimationsBtn.addEventListener('click', () => this.resetAnimations());
        
        // Ensemble weather events
        this.ensembleModels.addEventListener('change', () => this.updateEnsembleComparison());
        this.ensembleVariable.addEventListener('change', () => this.updateEnsembleComparison());
        this.ensembleForecast.addEventListener('change', () => this.updateEnsembleComparison());
        this.ensembleSpread.addEventListener('change', () => this.updateEnsembleComparison());
        this.ensembleMean.addEventListener('change', () => this.updateEnsembleComparison());
        this.compareEnsembleBtn.addEventListener('click', () => this.updateEnsembleComparison());
        this.exportEnsembleBtn.addEventListener('click', () => this.exportEnsembleData());
        
        // Historical weather events
        this.getHistoricalDataBtn.addEventListener('click', () => this.getHistoricalData());
        
        // Enhanced historical events
        this.exportHistoricalBtn.addEventListener('click', () => this.exportHistoricalData());
        
        // Chart tab events
        this.chartTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchChartType(e.target.dataset.chart));
        });
        
        // Flood monitoring events
        this.getFloodDataBtn.addEventListener('click', () => this.getFloodData());
        
        // Enhanced flood events
        this.exportFloodBtn.addEventListener('click', () => this.exportFloodData());
    }

    async loadDefaultLocation() {
        // Try to get user's location, otherwise load a default city
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    // Fallback to a default city
                    this.getWeatherByCity('London');
                }
            );
        } else {
            this.getWeatherByCity('London');
        }
    }

    async getCurrentLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    this.showError('Unable to get your location. Please search for a city.');
                    this.hideLoading();
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser.');
        }
    }

    async searchCity() {
        const city = this.citySearch.value.trim();
        if (city) {
            this.getWeatherByCity(city);
        } else {
            this.showError('Please enter a city name.');
        }
    }

    async getWeatherByCity(city) {
        this.showLoading();
        try {
            // First get coordinates for the city
            const geocodingResponse = await fetch(
                `${this.geocodingUrl}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );
            
            console.log('Geocoding URL:', `${this.geocodingUrl}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            console.log('Geocoding response status:', geocodingResponse.status);
            
            if (!geocodingResponse.ok) {
                console.error('Geocoding failed:', geocodingResponse.status, geocodingResponse.statusText);
                throw new Error(`Geocoding failed: ${geocodingResponse.status}`);
            }
            
            const geocodingData = await geocodingResponse.json();
            console.log('Geocoding data:', geocodingData);
            
            if (!geocodingData.results || geocodingData.results.length === 0) {
                throw new Error('City not found');
            }
            
            const location = geocodingData.results[0];
            this.currentCity = location.name;
            this.currentCoords = { lat: location.latitude, lon: location.longitude };
            
            console.log('Getting weather for:', location.latitude, location.longitude, location.name, location.country);
            this.getWeatherByCoords(location.latitude, location.longitude, location.name, location.country, this.currentForecastDays, this.currentWeatherModel);
        } catch (error) {
            console.error('Error in getWeatherByCity:', error);
            this.showError(`Error: ${error.message}`);
            this.hideLoading();
        }
    }

    async getWeatherByCoords(lat, lon, cityName = null, countryName = null, forecastDays = 16, weatherModel = 'auto') {
        this.showLoading();
        try {
            // Get comprehensive weather data from Open-Meteo with all available variables including pressure levels
            let weatherUrl = `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,surface_pressure,cloudcover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,windspeed_10m,winddirection_10m,windgusts_10m,weathercode,uv_index,visibility,precipitation,rain,showers,snowfall,dew_point_2m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,shortwave_radiation,direct_radiation,diffuse_radiation,global_tilted_irradiance,vapour_pressure_deficit,cape,evapotranspiration,et0_fao_evapotranspiration,snow_depth,freezing_level_height,is_day&hourly=temperature_2m,relativehumidity_2m,dew_point_2m,apparent_temperature,pressure_msl,surface_pressure,cloudcover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,windspeed_10m,winddirection_10m,windgusts_10m,wind_speed_80m,winddirection_80m,wind_speed_120m,winddirection_120m,wind_speed_180m,winddirection_180m,weathercode,uv_index,visibility,precipitation,rain,showers,snowfall,precipitation_probability,shortwave_radiation,direct_radiation,diffuse_radiation,global_tilted_irradiance,vapour_pressure_deficit,cape,evapotranspiration,et0_fao_evapotranspiration,snow_depth,freezing_level_height,is_day&daily=weathercode,temperature_2m_max,temperature_2m_mean,temperature_2m_min,apparent_temperature_max,apparent_temperature_mean,apparent_temperature_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,precipitation_probability_mean,precipitation_probability_min,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration,uv_index_max,uv_index_clear_sky_max,sunrise,sunset,daylight_duration,sunshine_duration&timezone=auto&forecast_days=${forecastDays}`;
            
            // Add pressure level data for advanced atmospheric analysis
            weatherUrl += `&hourly=temperature_1000hPa,temperature_975hPa,temperature_950hPa,temperature_925hPa,temperature_900hPa,temperature_850hPa,temperature_800hPa,temperature_700hPa,temperature_600hPa,temperature_500hPa,temperature_400hPa,temperature_300hPa,temperature_250hPa,temperature_200hPa,temperature_150hPa,temperature_100hPa,temperature_70hPa,temperature_50hPa,temperature_30hPa,relative_humidity_1000hPa,relative_humidity_975hPa,relative_humidity_950hPa,relative_humidity_925hPa,relative_humidity_900hPa,relative_humidity_850hPa,relative_humidity_800hPa,relative_humidity_700hPa,relative_humidity_600hPa,relative_humidity_500hPa,relative_humidity_400hPa,relative_humidity_300hPa,relative_humidity_250hPa,relative_humidity_200hPa,relative_humidity_150hPa,relative_humidity_100hPa,relative_humidity_70hPa,relative_humidity_50hPa,relative_humidity_30hPa,cloud_cover_1000hPa,cloud_cover_975hPa,cloud_cover_950hPa,cloud_cover_925hPa,cloud_cover_900hPa,cloud_cover_850hPa,cloud_cover_800hPa,cloud_cover_700hPa,cloud_cover_600hPa,cloud_cover_500hPa,cloud_cover_400hPa,cloud_cover_300hPa,cloud_cover_250hPa,cloud_cover_200hPa,cloud_cover_150hPa,cloud_cover_100hPa,cloud_cover_70hPa,cloud_cover_50hPa,cloud_cover_30hPa,wind_speed_1000hPa,wind_speed_975hPa,wind_speed_950hPa,wind_speed_925hPa,wind_speed_900hPa,wind_speed_850hPa,wind_speed_800hPa,wind_speed_700hPa,wind_speed_600hPa,wind_speed_500hPa,wind_speed_400hPa,wind_speed_300hPa,wind_speed_250hPa,wind_speed_200hPa,wind_speed_150hPa,wind_speed_100hPa,wind_speed_70hPa,wind_speed_50hPa,wind_speed_30hPa,wind_direction_1000hPa,wind_direction_975hPa,wind_direction_950hPa,wind_direction_925hPa,wind_direction_900hPa,wind_direction_850hPa,wind_direction_800hPa,wind_direction_700hPa,wind_direction_600hPa,wind_direction_500hPa,wind_direction_400hPa,wind_direction_300hPa,wind_direction_250hPa,wind_direction_200hPa,wind_direction_150hPa,wind_direction_100hPa,wind_direction_70hPa,wind_direction_50hPa,wind_direction_30hPa,geopotential_height_1000hPa,geopotential_height_975hPa,geopotential_height_950hPa,geopotential_height_925hPa,geopotential_height_900hPa,geopotential_height_850hPa,geopotential_height_800hPa,geopotential_height_700hPa,geopotential_height_600hPa,geopotential_height_500hPa,geopotential_height_400hPa,geopotential_height_300hPa,geopotential_height_250hPa,geopotential_height_200hPa,geopotential_height_150hPa,geopotential_height_100hPa,geopotential_height_70hPa,geopotential_height_50hPa,geopotential_height_30hPa`;
            
            // Add 15-minutely data support for high-resolution forecasts
            weatherUrl += `&minutely_15=temperature_2m,relativehumidity_2m,dew_point_2m,apparent_temperature,shortwave_radiation,direct_radiation,diffuse_radiation,global_tilted_irradiance,global_tilted_irradiance_instant,sunshine_duration,lightning_potential,precipitation,snowfall,rain,showers,snowfall_height,freezing_level_height,cape,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&forecast_minutely_15=96`; // 24 hours of 15-min data
            
            // Add weather model parameter if not auto
            if (weatherModel !== 'auto') {
                weatherUrl += `&models=${weatherModel}`;
            }
            
            console.log('Weather URL:', weatherUrl);
            const weatherResponse = await fetch(weatherUrl);
            
            console.log('Weather response status:', weatherResponse.status, weatherResponse.statusText);
            
            if (!weatherResponse.ok) {
                console.error('Weather API failed:', weatherResponse.status, weatherResponse.statusText);
                throw new Error(`Weather API failed: ${weatherResponse.status}`);
            }
            
            const weatherData = await weatherResponse.json();
            console.log('Weather data received:', weatherData);
            
            // Use provided city/country names or get from reverse geocoding
            if (!cityName || !countryName) {
                try {
                    const reverseGeocodingResponse = await fetch(
                        `${this.geocodingUrl}/reverse?latitude=${lat}&longitude=${lon}&format=json`
                    );
                    const reverseData = await reverseGeocodingResponse.json();
                    cityName = cityName || reverseData.results?.[0]?.name || 'Unknown Location';
                    countryName = countryName || reverseData.results?.[0]?.country || '';
                } catch (error) {
                    console.warn('Reverse geocoding failed:', error);
                    cityName = cityName || 'Unknown Location';
                    countryName = countryName || '';
                }
            }
            
            this.currentCity = cityName;
            this.currentCoords = { lat, lon };
            this.displayCurrentWeather(weatherData, cityName, countryName);
            this.displayForecast(weatherData);
            this.displayHourlyForecast(weatherData);
            
            // Automatically load weather map
            this.updateWeatherMap();
            
            this.hideLoading();
            this.showWeatherContent();
        } catch (error) {
            console.error('Error in getWeatherByCoords:', error);
            this.showError(`Weather data error: ${error.message}`);
            this.hideLoading();
        }
    }

    // Note: getForecast function is no longer needed as forecast data is fetched in getWeatherByCoords

    displayCurrentWeather(data, cityName, countryName) {
        // Location info
        this.cityName.textContent = cityName;
        this.countryName.textContent = countryName;
        this.currentDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Temperature
        const temp = this.currentUnit === 'metric' ? data.current.temperature_2m : this.celsiusToFahrenheit(data.current.temperature_2m);
        const feelsLike = this.currentUnit === 'metric' ? data.current.apparent_temperature : this.celsiusToFahrenheit(data.current.apparent_temperature);
        this.temperature.textContent = Math.round(temp);
        this.feelsLike.textContent = `Feels like ${Math.round(feelsLike)}°`;
        
        // Weather description and icon
        const weatherCode = data.current.weathercode;
        const weatherDescription = this.getWeatherDescription(weatherCode);
        this.weatherDescription.textContent = weatherDescription;
        this.updateWeatherIcon(weatherDescription);
        
        // Weather details
        this.humidity.textContent = `${data.current.relativehumidity_2m}%`;
        const windSpeed = this.currentUnit === 'metric' ? data.current.windspeed_10m : this.kmphToMph(data.current.windspeed_10m);
        this.windSpeed.textContent = `${windSpeed} ${this.currentUnit === 'metric' ? 'km/h' : 'mph'}`;
        this.pressure.textContent = `${data.current.pressure_msl} hPa`;
        this.visibility.textContent = `${data.current.visibility} km`;
        this.cloudiness.textContent = `${data.current.cloudcover}%`;
        
        // UV Index
        this.uvIndex.textContent = data.current.uv_index || 'N/A';
        
        // Additional data
        this.updateAdvancedMetrics(data);
        this.getAirQuality(this.currentCoords.lat, this.currentCoords.lon);
        this.updateWeatherAlerts(data);
        this.updateCharts(data);
        this.updateExtendedMetrics(data);
        
        // Store current weather data for advanced features
        this.currentWeatherData = data;
        
        // Update forecast controls with current values
        this.forecastDays.value = this.currentForecastDays || 16;
        this.forecastTitle.textContent = `${this.currentForecastDays || 16}-Day Extended Forecast`;
        
        // Initialize advanced features
        this.updatePressureLevel();
        this.updateMinutelyChart();
    }

    displayForecast(data) {
        this.forecastCards.innerHTML = '';
        
        // Open-Meteo provides daily forecast data
        const dailyForecasts = data.daily;
        const days = Math.min(16, dailyForecasts.time.length);
        
        for (let i = 0; i < days; i++) {
            const dayData = {
                date: dailyForecasts.time[i],
                maxTemp: this.currentUnit === 'metric' ? dailyForecasts.temperature_2m_max[i] : this.celsiusToFahrenheit(dailyForecasts.temperature_2m_max[i]),
                minTemp: this.currentUnit === 'metric' ? dailyForecasts.temperature_2m_min[i] : this.celsiusToFahrenheit(dailyForecasts.temperature_2m_min[i]),
                weatherCode: dailyForecasts.weathercode[i],
                precipitation: dailyForecasts.precipitation_sum[i],
                precipitationProbability: dailyForecasts.precipitation_probability_max[i]
            };
            
            const card = this.createForecastCard(dayData);
            this.forecastCards.appendChild(card);
        }
    }


    createForecastCard(dayData) {
        const date = new Date(dayData.date);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const weatherDescription = this.getWeatherDescription(dayData.weatherCode);
        
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">
                <i class="${this.getWeatherIconClass(weatherDescription)}"></i>
            </div>
            <div class="forecast-temps">
                <span class="temp-high">${Math.round(dayData.maxTemp)}${tempUnit}</span>
                <span class="temp-low">${Math.round(dayData.minTemp)}${tempUnit}</span>
            </div>
            <div class="forecast-desc">${weatherDescription}</div>
            <div class="forecast-precip">
                <i class="fas fa-droplet"></i> ${Math.round(dayData.precipitation)}mm (${dayData.precipitationProbability}%)
            </div>
        `;
        
        return card;
    }

    async getAirQuality(lat, lon) {
        try {
            const airQualityUrl = `${this.airQualityUrl}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&domains=cams_global&timezone=auto&forecast_days=1`;
            
            console.log('Air Quality URL:', airQualityUrl);
            const response = await fetch(airQualityUrl);
            
            console.log('Air Quality response status:', response.status, response.statusText);
            
            if (!response.ok) {
                console.error('Air Quality API failed:', response.status, response.statusText);
                throw new Error(`Air Quality API failed: ${response.status}`);
            }
            
            const airQualityData = await response.json();
            console.log('Air Quality data received:', airQualityData);
            this.displayAirQuality(airQualityData);
        } catch (error) {
            console.error('Error in getAirQuality:', error);
            console.warn('Air quality data unavailable:', error);
            // Fallback to simulated data if API fails
            this.displaySimulatedAirQuality();
        }
    }

    displayAirQuality(data) {
        // Get current hour's air quality data
        const currentHour = new Date().getHours();
        const pm25 = data.hourly.pm2_5[currentHour] || 0;
        const pm10 = data.hourly.pm10[currentHour] || 0;
        const carbonMonoxide = data.hourly.carbon_monoxide[currentHour] || 0;
        const nitrogenDioxide = data.hourly.nitrogen_dioxide[currentHour] || 0;
        const ozone = data.hourly.ozone[currentHour] || 0;
        
        // Calculate US AQI based on PM2.5 (primary pollutant)
        const aqi = this.calculateUSAQI(pm25, 'pm25');
        const level = this.getAQILevel(aqi);
        
        this.aqiNumber.textContent = aqi;
        this.aqiLevel.textContent = level;
        
        // Update detailed air quality info if elements exist
        this.updateDetailedAirQuality(pm25, pm10, carbonMonoxide, nitrogenDioxide, ozone);
    }

    calculateUSAQI(concentration, pollutant) {
        // US EPA breakpoints for PM2.5
        const breakpoints = {
            pm25: [
                { cLow: 0, cHigh: 12.0, iLow: 0, iHigh: 50 },
                { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
                { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
                { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
                { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
                { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 }
            ]
        };

        const pollutantBreakpoints = breakpoints[pollutant] || breakpoints.pm25;
        
        for (const bp of pollutantBreakpoints) {
            if (concentration >= bp.cLow && concentration <= bp.cHigh) {
                return Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow);
            }
        }
        
        return 500; // Hazardous
    }

    getAQILevel(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }

    updateDetailedAirQuality(pm25, pm10, carbonMonoxide, nitrogenDioxide, ozone) {
        // Update detailed air quality elements if they exist
        const pm25Element = document.getElementById('pm25');
        const pm10Element = document.getElementById('pm10');
        const coElement = document.getElementById('carbonMonoxide');
        const no2Element = document.getElementById('nitrogenDioxide');
        const o3Element = document.getElementById('ozone');
        
        if (pm25Element) pm25Element.textContent = `${pm25.toFixed(1)} μg/m³`;
        if (pm10Element) pm10Element.textContent = `${pm10.toFixed(1)} μg/m³`;
        if (coElement) coElement.textContent = `${carbonMonoxide.toFixed(1)} μg/m³`;
        if (no2Element) no2Element.textContent = `${nitrogenDioxide.toFixed(1)} μg/m³`;
        if (o3Element) o3Element.textContent = `${ozone.toFixed(1)} μg/m³`;
    }

    displaySimulatedAirQuality() {
        // Fallback to simulated data if API fails
        const aqi = Math.floor(Math.random() * 150) + 20;
        const level = this.getAQILevel(aqi);
        
        this.aqiNumber.textContent = aqi;
        this.aqiLevel.textContent = level;
    }

    updateWeatherAlerts(data) {
        // Simulate weather alerts
        const alerts = [];
        
        if (data.current.windspeed_10m > 50) {
            alerts.push({ type: 'High Wind', message: 'Strong winds expected. Secure outdoor objects.' });
        }
        
        if (data.current.uv_index > 8) {
            alerts.push({ type: 'UV Warning', message: 'Very high UV levels. Use sun protection.' });
        }
        
        if (alerts.length === 0) {
            this.alertsContainer.innerHTML = '<div class="no-alerts">No active weather alerts</div>';
        } else {
            this.alertsContainer.innerHTML = alerts.map(alert => 
                `<div class="alert-item">
                    <strong>${alert.type}:</strong> ${alert.message}
                </div>`
            ).join('');
        }
    }

    updateCharts(data) {
        // Simple chart implementation using canvas
        this.drawTempChart(data);
        this.drawPrecipChart(data);
    }

    drawTempChart(data) {
        if (!this.tempChart) return;
        
        const ctx = this.tempChart.getContext('2d');
        const temps = data.daily.temperature_2m_max.slice(0, 7);
        const labels = data.daily.time.slice(0, 7).map(date => 
            new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        // Simple line chart
        ctx.clearRect(0, 0, this.tempChart.width, this.tempChart.height);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const padding = 40;
        const chartWidth = this.tempChart.width - padding * 2;
        const chartHeight = this.tempChart.height - padding * 2;
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const tempRange = maxTemp - minTemp;
        
        temps.forEach((temp, i) => {
            const x = padding + (i / (temps.length - 1)) * chartWidth;
            const y = padding + (1 - (temp - minTemp) / tempRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            // Draw point
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#718096';
        ctx.font = '10px Arial';
        labels.forEach((label, i) => {
            const x = padding + (i / (labels.length - 1)) * chartWidth;
            ctx.fillText(label, x - 15, this.tempChart.height - 10);
        });
    }

    drawPrecipChart(data) {
        if (!this.precipChart) return;
        
        const ctx = this.precipChart.getContext('2d');
        const precip = data.daily.precipitation_sum.slice(0, 7);
        const labels = data.daily.time.slice(0, 7).map(date => 
            new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        ctx.clearRect(0, 0, this.precipChart.width, this.precipChart.height);
        
        const padding = 40;
        const chartWidth = this.precipChart.width - padding * 2;
        const chartHeight = this.precipChart.height - padding * 2;
        const maxPrecip = Math.max(...precip, 1);
        const barWidth = chartWidth / precip.length * 0.6;
        
        precip.forEach((amount, i) => {
            const x = padding + (i / precip.length) * chartWidth + barWidth * 0.2;
            const height = (amount / maxPrecip) * chartHeight;
            const y = padding + chartHeight - height;
            
            // Draw bar
            ctx.fillStyle = '#4299e1';
            ctx.fillRect(x, y, barWidth, height);
            
            // Draw label
            ctx.fillStyle = '#718096';
            ctx.font = '10px Arial';
            ctx.fillText(labels[i], x - 15, this.precipChart.height - 10);
            ctx.fillText(`${amount}mm`, x + barWidth/2 - 10, y - 5);
        });
    }

    updateExtendedMetrics(data) {
        // Display real extended metrics from Open-Meteo API
        const soilTemp0 = data.current?.soil_temperature_0cm || '--';
        const soilMoisture0 = data.current?.soil_moisture_0_to_1cm || '--';
        const evapotranspiration = data.current?.evapotranspiration || '--';
        const vapourPressureDeficit = data.current?.vapour_pressure_deficit || '--';
        const cape = data.current?.cape || '--';
        const snowDepth = data.current?.snow_depth || '--';
        const freezingLevel = data.current?.freezing_level_height || '--';
        
        // Note: elevation element removed to fix null error
        this.soilMoisture.textContent = soilMoisture0 !== '--' ? `${soilMoisture0.toFixed(1)} m³/m³` : '--';
        this.evapotranspiration.textContent = evapotranspiration !== '--' ? `${evapotranspiration.toFixed(2)}mm/h` : '--';
        
        // Update additional metrics display if elements exist
        this.updateDetailedMetrics(data);
    }

    updateDetailedMetrics(data) {
        // Update cloud cover levels
        const cloudLow = document.getElementById('cloudCoverLow');
        const cloudMid = document.getElementById('cloudCoverMid');
        const cloudHigh = document.getElementById('cloudCoverHigh');
        
        if (cloudLow) cloudLow.textContent = `${data.current?.cloud_cover_low || '--'}%`;
        if (cloudMid) cloudMid.textContent = `${data.current?.cloud_cover_mid || '--'}%`;
        if (cloudHigh) cloudHigh.textContent = `${data.current?.cloud_cover_high || '--'}%`;
        
        // Update precipitation breakdown
        const rain = document.getElementById('rain');
        const showers = document.getElementById('showers');
        
        if (rain) rain.textContent = `${data.current?.rain || '--'}mm`;
        if (showers) showers.textContent = `${data.current?.showers || '--'}mm`;
        
        // Update solar radiation
        const shortwaveRadiation = document.getElementById('shortwaveRadiation');
        const directRadiation = document.getElementById('directRadiation');
        const diffuseRadiation = document.getElementById('diffuseRadiation');
        
        if (shortwaveRadiation) shortwaveRadiation.textContent = `${data.current?.shortwave_radiation || '--'}W/m²`;
        if (directRadiation) directRadiation.textContent = `${data.current?.direct_radiation || '--'}W/m²`;
        if (diffuseRadiation) diffuseRadiation.textContent = `${data.current?.diffuse_radiation || '--'}W/m²`;
        
        // Update advanced atmospheric data
        const vapourPressureDeficitEl = document.getElementById('vapourPressureDeficit');
        const capeEl = document.getElementById('cape');
        const snowDepthEl = document.getElementById('snowDepth');
        const freezingLevelEl = document.getElementById('freezingLevel');
        
        if (vapourPressureDeficitEl) vapourPressureDeficitEl.textContent = `${data.current?.vapour_pressure_deficit || '--'}kPa`;
        if (capeEl) capeEl.textContent = `${data.current?.cape || '--'}J/kg`;
        if (snowDepthEl) snowDepthEl.textContent = `${data.current?.snow_depth || '--'}m`;
        if (freezingLevelEl) freezingLevelEl.textContent = `${data.current?.freezing_level_height || '--'}m`;
    }

    updatePressureLevel() {
        const selectedLevel = this.pressureLevel.value;
        if (!this.currentWeatherData) return;
        
        const hourlyData = this.currentWeatherData.hourly;
        const currentIndex = 0; // Current hour
        
        // Update pressure level display
        this.pressureTemp.textContent = `${hourlyData[`temperature_${selectedLevel}`]?.[currentIndex] || '--'}°C`;
        this.pressureHumidity.textContent = `${hourlyData[`relative_humidity_${selectedLevel}`]?.[currentIndex] || '--'}%`;
        this.pressureWindSpeed.textContent = `${hourlyData[`wind_speed_${selectedLevel}`]?.[currentIndex] || '--'}km/h`;
        this.pressureWindDirection.textContent = `${hourlyData[`wind_direction_${selectedLevel}`]?.[currentIndex] || '--'}°`;
        this.pressureCloudCover.textContent = `${hourlyData[`cloud_cover_${selectedLevel}`]?.[currentIndex] || '--'}%`;
        this.pressureGeopotential.textContent = `${hourlyData[`geopotential_height_${selectedLevel}`]?.[currentIndex] || '--'}m`;
    }

    updateMinutelyChart() {
        if (!this.currentWeatherData || !this.currentWeatherData.minutely_15) return;
        
        const selectedVariable = this.minutelyVariable.value;
        const minutelyData = this.currentWeatherData.minutely_15;
        
        this.drawMinutelyChart(minutelyData, selectedVariable);
    }

    drawMinutelyChart(data, variable) {
        if (!this.minutelyChart) return;
        
        const ctx = this.minutelyChart.getContext('2d');
        const values = data[variable] || [];
        const times = data.time || [];
        
        // Clear canvas
        ctx.clearRect(0, 0, this.minutelyChart.width, this.minutelyChart.height);
        
        if (values.length === 0) return;
        
        const padding = 40;
        const chartWidth = this.minutelyChart.width - padding * 2;
        const chartHeight = this.minutelyChart.height - padding * 2;
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue;
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding);
        ctx.stroke();
        
        // Draw data line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Draw points
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#718096';
        ctx.font = '10px Arial';
        
        // X-axis labels (time)
        for (let i = 0; i < values.length; i += 12) { // Show every 3 hours
            const time = new Date(times[i]);
            const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const x = padding + (i / (values.length - 1)) * chartWidth;
            ctx.fillText(timeStr, x - 20, this.minutelyChart.height - 10);
        }
        
        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (valueRange * i / 5);
            const y = padding + (1 - i / 5) * chartHeight;
            ctx.fillText(value.toFixed(1), 5, y + 3);
        }
    }

    displayFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesList.innerHTML = '<div class="no-favorites">No favorite locations yet</div>';
            return;
        }
        
        this.favoritesList.innerHTML = this.favorites.map((fav, index) => 
            `<div class="favorite-item" data-index="${index}">
                <span>${fav.name}</span>
                <i class="fas fa-times favorite-remove" data-index="${index}"></i>
            </div>`
        ).join('');
        
        // Add event listeners
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-remove')) {
                    const fav = this.favorites[item.dataset.index];
                    this.getWeatherByCity(fav.name);
                }
            });
        });
        
        document.querySelectorAll('.favorite-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(parseInt(btn.dataset.index));
            });
        });
    }

    addFavorite() {
        if (!this.currentCity) return;
        
        const exists = this.favorites.find(fav => fav.name === this.currentCity);
        if (exists) {
            this.showError('Location already in favorites');
            return;
        }
        
        this.favorites.push({
            name: this.currentCity,
            lat: this.currentCoords.lat,
            lon: this.currentCoords.lon
        });
        
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        this.displayFavorites();
    }

    removeFavorite(index) {
        this.favorites.splice(index, 1);
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        this.displayFavorites();
    }

    toggleFavorites() {
        this.addFavorite();
    }

    updateForecastSettings() {
        const forecastDays = this.forecastDays.value;
        const weatherModel = this.weatherModel.value;
        
        // Update title
        this.forecastTitle.textContent = `${forecastDays}-Day Extended Forecast`;
        
        // Re-fetch weather data with new settings
        if (this.currentCoords.lat && this.currentCoords.lon) {
            this.getWeatherByCoords(this.currentCoords.lat, this.currentCoords.lon, this.currentCity, null, forecastDays, weatherModel);
        }
    }

    openSettings() {
        alert('Settings panel coming soon! Features will include:\n- Theme selection\n- Notification preferences\n- Data refresh intervals\n- Language options');
    }

    getWeatherIconClass(weatherText) {
        const text = weatherText.toLowerCase();
        if (text.includes('clear') || text.includes('sunny')) return 'fas fa-sun';
        if (text.includes('partly cloudy') || text.includes('mainly clear')) return 'fas fa-cloud-sun';
        if (text.includes('overcast') || text.includes('cloud')) return 'fas fa-cloud';
        if (text.includes('fog') || text.includes('rime')) return 'fas fa-smog';
        if (text.includes('drizzle') || text.includes('rain')) return 'fas fa-cloud-rain';
        if (text.includes('freezing')) return 'fas fa-icicles';
        if (text.includes('snow')) return 'fas fa-snowflake';
        if (text.includes('thunderstorm') || text.includes('hail')) return 'fas fa-bolt';
        if (text.includes('shower')) return 'fas fa-cloud-showers-heavy';
        
        return 'fas fa-sun'; // default
    }

    getWeatherDescription(weatherCode) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        
        return weatherCodes[weatherCode] || 'Unknown';
    }

    updateWeatherIcon(weatherText) {
        const iconClass = this.getWeatherIconClass(weatherText);
        this.weatherIcon.className = iconClass;
    }

    toggleUnits() {
        this.currentUnit = this.currentUnit === 'metric' ? 'imperial' : 'metric';
        if (this.currentCity) {
            this.getWeatherByCity(this.currentCity);
        }
    }

    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    kmphToMph(kmph) {
        return kmph * 0.621371;
    }
    
    updateAdvancedMetrics(data) {
        // Update advanced metrics if elements exist
        const windDirection = document.getElementById('windDirection');
        const dewPoint = document.getElementById('dewPoint');
        const precipitation = document.getElementById('precipitation');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        
        if (windDirection) {
            windDirection.textContent = `${data.current.winddirection_10m}° ${this.getWindDirection(data.current.winddirection_10m)}`;
        }
        
        if (dewPoint) {
            const dew = this.currentUnit === 'metric' ? data.current.dew_point_2m || 0 : this.celsiusToFahrenheit(data.current.dew_point_2m || 0);
            dewPoint.textContent = `${Math.round(dew)}°${this.currentUnit === 'metric' ? 'C' : 'F'}`;
        }
        
        if (precipitation) {
            precipitation.textContent = `${data.current.precipitation || 0} mm`;
        }
        
        if (sunrise && data.daily?.sunrise) {
            sunrise.textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        
        if (sunset && data.daily?.sunset) {
            sunset.textContent = new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
    
    displayHourlyForecast(data) {
        const hourlyContainer = document.getElementById('hourlyForecast');
        if (!hourlyContainer) return;
        
        hourlyContainer.innerHTML = '';
        const hours = Math.min(24, data.hourly.time.length);
        
        for (let i = 0; i < hours; i += 3) { // Show every 3 hours
            const hourData = {
                time: data.hourly.time[i],
                temp: this.currentUnit === 'metric' ? data.hourly.temperature_2m[i] : this.celsiusToFahrenheit(data.hourly.temperature_2m[i]),
                weatherCode: data.hourly.weathercode[i],
                precipitation: data.hourly.precipitation[i],
                windSpeed: this.currentUnit === 'metric' ? data.hourly.windspeed_10m[i] : this.kmphToMph(data.hourly.windspeed_10m[i])
            };
            
            const hourCard = this.createHourlyCard(hourData);
            hourlyContainer.appendChild(hourCard);
        }
    }
    
    createHourlyCard(hourData) {
        const card = document.createElement('div');
        card.className = 'hourly-card';
        
        const time = new Date(hourData.time);
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const weatherDescription = this.getWeatherDescription(hourData.weatherCode);
        
        card.innerHTML = `
            <div class="hourly-time">${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="hourly-icon">
                <i class="${this.getWeatherIconClass(weatherDescription)}"></i>
            </div>
            <div class="hourly-temp">${Math.round(hourData.temp)}${tempUnit}</div>
            <div class="hourly-precip">
                <i class="fas fa-droplet"></i> ${Math.round(hourData.precipitation)}mm
            </div>
            <div class="hourly-wind">
                <i class="fas fa-wind"></i> ${Math.round(hourData.windSpeed)}${this.currentUnit === 'metric' ? 'km/h' : 'mph'}
            </div>
        `;
        
        return card;
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(message) {
        console.error('Displaying error to user:', message);
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.weatherContent.classList.add('hidden');
    }

    showWeatherContent() {
        this.weatherContent.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
    }

    async getHistoricalData() {
        const startDate = this.startDate.value;
        const endDate = this.endDate.value;
        const model = this.historicalModel.value;
        
        console.log('Getting historical data with:', { startDate, endDate, model, coords: this.currentCoords });
        
        if (!startDate || !endDate) {
            this.showError('Please select both start and end dates');
            return;
        }
        
        if (!this.currentCoords.lat || !this.currentCoords.lon) {
            this.showError('Please search for a location first');
            return;
        }
        
        // Validate dates - ensure end date is not too recent (5-day delay)
        const endDateObj = new Date(endDate);
        const today = new Date();
        const fiveDaysAgo = new Date(today.getTime() - (5 * 24 * 60 * 60 * 1000));
        
        if (endDateObj > fiveDaysAgo) {
            this.showError('Historical data has a 5-day delay. Please select an end date at least 5 days ago.');
            return;
        }
        
        this.showLoading();
        
        try {
            // Get selected variables
            const selectedOptions = Array.from(this.historicalVariables.selectedOptions);
            const variables = selectedOptions.map(option => option.value).join(',');
            
            // Build historical API URL with comprehensive variables
            let historicalUrl = `${this.archiveUrl}?latitude=${this.currentCoords.lat}&longitude=${this.currentCoords.lon}&start_date=${startDate}&end_date=${endDate}&hourly=${variables}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,shortwave_radiation_sum,et0_fao_evapotranspiration,sunrise,sunset,daylight_duration,sunshine_duration&timezone=auto`;
            
            // Add model parameter if not default
            if (model !== 'era5') {
                historicalUrl += `&models=${model}`;
            }
            
            console.log('Historical URL:', historicalUrl);
            
            const response = await fetch(historicalUrl);
            console.log('Historical response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Historical API failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Historical data received:', data);
            console.log('Hourly data keys:', Object.keys(data.hourly || {}));
            console.log('Daily data keys:', Object.keys(data.daily || {}));
            
            // Check if we have valid data
            if (!data || (!data.hourly && !data.daily)) {
                this.showError('No historical data available for this date range');
                this.hideLoading();
                return;
            }
            
            this.historicalWeatherData = data;
            this.displayHistoricalData(data);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error fetching historical data:', error);
            this.showError(`Historical data error: ${error.message}`);
            this.hideLoading();
        }
    }

    displayHistoricalData(data) {
        console.log('Displaying historical data:', data);
        
        if (!data.hourly && !data.daily) {
            this.showError('No historical data available');
            return;
        }
        
        // Store data for export
        this.historicalWeatherData = data;
        
        // Display daily summary if available
        if (data.daily) {
            this.displayHistoricalSummary(data.daily);
        }
        
        // Detect weather anomalies if enabled
        if (this.historicalAnomaly?.checked) {
            this.detectWeatherAnomalies(data);
        }
        
        // Draw historical chart
        this.drawHistoricalChart(data);
    }

    displayHistoricalSummary(dailyData) {
        console.log('Daily data available:', dailyData);
        console.log('Historical summary elements:', {
            avgTemp: this.historicalAvgTemp,
            maxTemp: this.historicalMaxTemp,
            minTemp: this.historicalMinTemp,
            totalPrecip: this.historicalTotalPrecip
        });
        
        // Calculate summary statistics
        const temps = dailyData.temperature_2m_mean || [];
        const maxTemps = dailyData.temperature_2m_max || [];
        const minTemps = dailyData.temperature_2m_min || [];
        const precipitation = dailyData.precipitation_sum || [];
        const windSpeed = dailyData.windspeed_10m_max || [];
        const pressure = dailyData.pressure_msl || [];
        const humidity = dailyData.relativehumidity_2m_mean || [];
        const radiation = dailyData.shortwave_radiation_sum || [];
        
        console.log('Temperature arrays:', { temps, maxTemps, minTemps, precipitation });
        
        if (temps.length > 0 && this.historicalAvgTemp && this.historicalMaxTemp && this.historicalMinTemp && this.historicalTotalPrecip) {
            const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
            const maxTemp = Math.max(...maxTemps);
            const minTemp = Math.min(...minTemps);
            const totalPrecip = precipitation.reduce((a, b) => a + b, 0);
            const avgWind = windSpeed.length > 0 ? windSpeed.reduce((a, b) => a + b, 0) / windSpeed.length : 0;
            const avgPressure = pressure.length > 0 ? pressure.reduce((a, b) => a + b, 0) / pressure.length : 0;
            const avgHumidity = humidity.length > 0 ? humidity.reduce((a, b) => a + b, 0) / humidity.length : 0;
            const totalRadiation = radiation.reduce((a, b) => a + b, 0);
            
            console.log('Calculated values:', { avgTemp, maxTemp, minTemp, totalPrecip, avgWind, avgPressure, avgHumidity, totalRadiation });
            
            // Update summary display
            this.historicalAvgTemp.textContent = `${avgTemp.toFixed(1)}°C`;
            this.historicalMaxTemp.textContent = `${maxTemp.toFixed(1)}°C`;
            this.historicalMinTemp.textContent = `${minTemp.toFixed(1)}°C`;
            this.historicalTotalPrecip.textContent = `${totalPrecip.toFixed(1)}mm`;
            
            // Update enhanced summary elements
            if (this.historicalAvgWind) this.historicalAvgWind.textContent = `${avgWind.toFixed(1)} km/h`;
            if (this.historicalAvgPressure) this.historicalAvgPressure.textContent = `${avgPressure.toFixed(0)} hPa`;
            if (this.historicalAvgHumidity) this.historicalAvgHumidity.textContent = `${avgHumidity.toFixed(1)}%`;
            if (this.historicalTotalRadiation) this.historicalTotalRadiation.textContent = `${(totalRadiation/1000).toFixed(1)} MJ/m²`;
            
            console.log(`Historical Summary - Avg: ${avgTemp.toFixed(1)}°C, Max: ${maxTemp.toFixed(1)}°C, Min: ${minTemp.toFixed(1)}°C, Total Precip: ${totalPrecip.toFixed(1)}mm`);
        } else {
            console.log('Missing data or elements for historical summary');
        }
    }

    drawHistoricalChart(data) {
        console.log('Drawing historical chart...');
        console.log('Historical chart element:', this.historicalChart);
        
        if (!this.historicalChart) {
            console.log('Historical chart element not found');
            return;
        }
        
        const ctx = this.historicalChart.getContext('2d');
        console.log('Canvas context:', ctx);
        
        const selectedOptions = Array.from(this.historicalVariables.selectedOptions);
        const primaryVariable = selectedOptions[0]?.value || 'temperature_2m';
        
        console.log('Drawing historical chart for variable:', primaryVariable);
        console.log('Available hourly data keys:', Object.keys(data.hourly || {}));
        console.log('Available daily data keys:', Object.keys(data.daily || {}));
        
        // Try hourly first, fallback to daily
        let values = data.hourly?.[primaryVariable] || [];
        let times = data.hourly?.time || [];
        
        if (values.length === 0 && data.daily) {
            // Map daily variables to hourly equivalents
            const dailyMap = {
                'temperature_2m': 'temperature_2m_mean',
                'relative_humidity_2m': 'relativehumidity_2m_mean',
                'wind_speed_10m': 'windspeed_10m_max',
                'pressure_msl': 'pressure_msl',
                'precipitation': 'precipitation_sum',
                'cloud_cover': 'cloudcover_mean',
                'shortwave_radiation': 'shortwave_radiation_sum'
            };
            
            const dailyVar = dailyMap[primaryVariable] || primaryVariable;
            values = data.daily[dailyVar] || [];
            times = data.daily.time || [];
        }
        
        console.log('Values array:', values);
        console.log('Times array:', times);
        console.log('Values length:', values.length);
        console.log('Times length:', times.length);
        
        // Clear canvas
        ctx.clearRect(0, 0, this.historicalChart.width, this.historicalChart.height);
        console.log('Canvas cleared');
        
        if (values.length === 0) {
            console.log('No values to display');
            // Show "No Data" message
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available for selected variable', this.historicalChart.width / 2, this.historicalChart.height / 2);
            ctx.textAlign = 'left';
            return;
        }
        
        const padding = 50;
        const chartWidth = this.historicalChart.width - padding * 2;
        const chartHeight = this.historicalChart.height - padding * 2;
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue;
        
        console.log('Chart dimensions:', { chartWidth, chartHeight });
        console.log('Value range:', { minValue, maxValue, valueRange });
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Draw grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight * i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw line chart
        this.drawLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
        
        // Draw labels
        ctx.fillStyle = '#718096';
        ctx.font = '12px Arial';
        
        // X-axis labels (dates)
        const labelInterval = Math.max(1, Math.floor(values.length / 10));
        for (let i = 0; i < values.length; i += labelInterval) {
            const time = new Date(times[i]);
            const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const x = padding + (i / (values.length - 1)) * chartWidth;
            ctx.fillText(dateStr, x - 20, this.historicalChart.height - 20);
        }
        
        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (valueRange * i / 5);
            const y = padding + (1 - i / 5) * chartHeight;
            const unit = this.getVariableUnit(primaryVariable);
            ctx.fillText(`${value.toFixed(1)}${unit}`, 5, y + 3);
        }
        
        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Arial';
        const title = this.getVariableDisplayName(primaryVariable);
        ctx.fillText(`Historical ${title} (${this.currentChartType})`, padding, padding - 20);
    }

    drawLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        // Draw data line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Draw points
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawBarChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        const barWidth = chartWidth / values.length * 0.8;
        const barSpacing = chartWidth / values.length;
        
        values.forEach((value, i) => {
            const x = padding + (i * barSpacing) + (barSpacing - barWidth) / 2;
            const barHeight = ((value - minValue) / valueRange) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    drawScatterChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    getVariableUnit(variable) {
        const units = {
            'temperature_2m': '°C',
            'relative_humidity_2m': '%',
            'precipitation': 'mm',
            'wind_speed_10m': 'km/h',
            'pressure_msl': 'hPa',
            'cloud_cover': '%',
            'shortwave_radiation': 'W/m²',
            'et0_fao_evapotranspiration': 'mm'
        };
        return units[variable] || '';
    }

    getVariableDisplayName(variable) {
        const names = {
            'temperature_2m': 'Temperature',
            'relative_humidity_2m': 'Relative Humidity',
            'precipitation': 'Precipitation',
            'wind_speed_10m': 'Wind Speed',
            'pressure_msl': 'Sea Level Pressure',
            'cloud_cover': 'Cloud Cover',
            'shortwave_radiation': 'Solar Radiation',
            'et0_fao_evapotranspiration': 'Reference Evapotranspiration'
        };
        return names[variable] || variable;
    }

    async getFloodData() {
        const model = this.floodModel.value;
        const forecastDays = this.floodForecastDays.value;
        const ensemble = this.floodEnsemble.checked;
        
        console.log('Getting flood data with:', { model, forecastDays, ensemble, coords: this.currentCoords });
        
        if (!this.currentCoords.lat || !this.currentCoords.lon) {
            this.showError('Please search for a location first');
            return;
        }
        
        this.showLoading();
        
        try {
            // Get selected variables
            const selectedOptions = Array.from(this.floodVariables.selectedOptions);
            const variables = selectedOptions.map(option => option.value).join(',');
            
            // Build flood API URL
            let floodUrl = `${this.floodUrl}?latitude=${this.currentCoords.lat}&longitude=${this.currentCoords.lon}&daily=${variables}&forecast_days=${forecastDays}&timezone=auto`;
            
            // Add model parameter if not default
            if (model !== 'glofas_v4') {
                floodUrl += `&models=${model}`;
            }
            
            // Add ensemble parameter if checked
            if (ensemble) {
                floodUrl += `&ensemble=true`;
            }
            
            console.log('Flood URL:', floodUrl);
            
            const response = await fetch(floodUrl);
            console.log('Flood response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Flood API failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Flood data received:', data);
            console.log('Daily flood data keys:', Object.keys(data.daily || {}));
            
            // Check if we have valid data
            if (!data || !data.daily) {
                this.showError('No flood data available for this location');
                this.hideLoading();
                return;
            }
            
            this.displayFloodData(data);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error fetching flood data:', error);
            this.showError(`Flood data error: ${error.message}`);
            this.hideLoading();
        }
    }

    displayFloodData(data) {
        console.log('Displaying flood data:', data);
        
        if (!data.daily) {
            this.showError('No flood data available');
            return;
        }
        
        // Store data for export
        this.floodWeatherData = data;
        
        // Display flood summary
        this.displayFloodSummary(data.daily);
        
        // Detect flood anomalies if enabled
        if (this.floodAlerts?.checked) {
            this.detectFloodAnomalies(data);
        }
        
        // Draw flood chart
        this.drawFloodChart(data);
    }

    displayFloodSummary(dailyData) {
        console.log('Daily flood data available:', dailyData);
        console.log('Flood summary elements:', {
            current: this.currentDischarge,
            mean: this.meanDischarge,
            max: this.maxDischarge,
            min: this.minDischarge
        });
        
        // Calculate summary statistics
        const discharge = dailyData.river_discharge || [];
        const meanDischarge = dailyData.river_discharge_mean || [];
        const maxDischarge = dailyData.river_discharge_max || [];
        const minDischarge = dailyData.river_discharge_min || [];
        
        console.log('Discharge arrays:', { discharge, meanDischarge, maxDischarge, minDischarge });
        
        if (discharge.length > 0 && this.currentDischarge && this.meanDischarge && this.maxDischarge && this.minDischarge) {
            const current = discharge[discharge.length - 1]; // Latest value
            const mean = meanDischarge.length > 0 ? meanDischarge[meanDischarge.length - 1] : '--';
            const max = maxDischarge.length > 0 ? Math.max(...maxDischarge) : '--';
            const min = minDischarge.length > 0 ? Math.min(...minDischarge) : '--';
            
            console.log('Calculated flood values:', { current, mean, max, min });
            
            // Update summary display
            this.currentDischarge.textContent = current !== '--' ? `${current.toFixed(2)} m³/s` : '--';
            this.meanDischarge.textContent = mean !== '--' ? `${mean.toFixed(2)} m³/s` : '--';
            this.maxDischarge.textContent = max !== '--' ? `${max.toFixed(2)} m³/s` : '--';
            this.minDischarge.textContent = min !== '--' ? `${min.toFixed(2)} m³/s` : '--';
            
            console.log(`Flood Summary - Current: ${current.toFixed(2)} m³/s, Mean: ${mean !== '--' ? mean.toFixed(2) : '--'} m³/s, Max: ${max !== '--' ? max.toFixed(2) : '--'} m³/s, Min: ${min !== '--' ? min.toFixed(2) : '--'} m³/s`);
        } else {
            console.log('Missing data or elements for flood summary');
        }
    }

    drawFloodChart(data) {
        console.log('Drawing flood chart...');
        console.log('Flood chart element:', this.floodChart);
        
        if (!this.floodChart) {
            console.log('Flood chart element not found');
            return;
        }
        
        const ctx = this.floodChart.getContext('2d');
        console.log('Flood canvas context:', ctx);
        
        const selectedOptions = Array.from(this.floodVariables.selectedOptions);
        const primaryVariable = selectedOptions[0]?.value || 'river_discharge';
        
        console.log('Drawing flood chart for variable:', primaryVariable);
        console.log('Available daily data keys:', Object.keys(data.daily || {}));
        
        const values = data.daily[primaryVariable] || [];
        const times = data.daily.time || [];
        
        console.log('Flood values array:', values);
        console.log('Flood times array:', times);
        console.log('Flood values length:', values.length);
        
        // Clear canvas
        ctx.clearRect(0, 0, this.floodChart.width, this.floodChart.height);
        console.log('Flood canvas cleared');
        
        if (values.length === 0) {
            console.log('No flood values to display');
            // Show "No Data" message
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No flood data available', this.floodChart.width / 2, this.floodChart.height / 2);
            ctx.textAlign = 'left';
            return;
        }
        
        const padding = 50;
        const chartWidth = this.floodChart.width - padding * 2;
        const chartHeight = this.floodChart.height - padding * 2;
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue;
        
        console.log('Flood chart dimensions:', { chartWidth, chartHeight });
        console.log('Flood value range:', { minValue, maxValue, valueRange });
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Draw grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight * i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw line chart
        this.drawFloodLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
        
        // Draw labels
        ctx.fillStyle = '#718096';
        ctx.font = '12px Arial';
        
        // X-axis labels (dates)
        const labelInterval = Math.max(1, Math.floor(values.length / 10));
        for (let i = 0; i < values.length; i += labelInterval) {
            const time = new Date(times[i]);
            const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const x = padding + (i / (values.length - 1)) * chartWidth;
            ctx.fillText(dateStr, x - 20, this.floodChart.height - 20);
        }
        
        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (valueRange * i / 5);
            const y = padding + (1 - i / 5) * chartHeight;
            ctx.fillText(`${value.toFixed(1)} m³/s`, 5, y + 3);
        }
        
        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Arial';
        const title = this.getFloodVariableDisplayName(primaryVariable);
        ctx.fillText(`Flood ${title} (${this.currentChartType})`, padding, padding - 20);
    }

    drawFloodLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        // Draw data line
        ctx.strokeStyle = '#4299e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Draw points
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            ctx.fillStyle = '#4299e1';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawFloodBarChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        const barWidth = chartWidth / values.length * 0.8;
        const barSpacing = chartWidth / values.length;
        
        values.forEach((value, i) => {
            const x = padding + (i * barSpacing) + (barSpacing - barWidth) / 2;
            const barHeight = ((value - minValue) / valueRange) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            ctx.fillStyle = '#4299e1';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    drawFloodAreaChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        // Draw filled area
        ctx.fillStyle = 'rgba(66, 153, 225, 0.3)';
        ctx.beginPath();
        
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, padding + chartHeight);
            else ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw line on top
        this.drawFloodLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
    }

    drawFloodComparisonChart(ctx, data, times, padding, chartWidth, chartHeight) {
        const selectedOptions = Array.from(this.floodVariables.selectedOptions);
        const colors = ['#4299e1', '#667eea', '#48bb78', '#ed8936', '#9f7aea'];
        
        selectedOptions.slice(0, 3).forEach((option, index) => {
            const variable = option.value;
            const values = data.daily[variable] || [];
            
            if (values.length > 0) {
                const maxValue = Math.max(...values);
                const minValue = Math.min(...values);
                const valueRange = maxValue - minValue;
                
                ctx.strokeStyle = colors[index % colors.length];
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                values.forEach((value, i) => {
                    const x = padding + (i / (values.length - 1)) * chartWidth;
                    const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                
                ctx.stroke();
            }
        });
    }

    getFloodVariableDisplayName(variable) {
        const names = {
            'river_discharge': 'River Discharge',
            'river_discharge_mean': 'River Discharge Mean',
            'river_discharge_median': 'River Discharge Median',
            'river_discharge_max': 'River Discharge Maximum',
            'river_discharge_min': 'River Discharge Minimum',
            'river_discharge_p25': 'River Discharge 25th Percentile',
            'river_discharge_p75': 'River Discharge 75th Percentile'
        };
        return names[variable] || variable;
    }

    switchChartType(type) {
        this.currentChartType = type;
        
        // Update active tab
        this.chartTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-chart="${type}"]`).classList.add('active');
        
        // Redraw chart with new type
        if (this.historicalWeatherData) {
            this.drawHistoricalChart(this.historicalWeatherData);
        }
        if (this.floodWeatherData) {
            this.drawFloodChart(this.floodWeatherData);
        }
    }

    exportHistoricalData() {
        if (!this.historicalWeatherData) {
            this.showError('No historical data to export');
            return;
        }
        
        try {
            const csvContent = this.convertToCSV(this.historicalWeatherData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `historical_weather_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export historical data');
        }
    }

    exportFloodData() {
        if (!this.floodWeatherData) {
            this.showError('No flood data to export');
            return;
        }
        
        try {
            const csvContent = this.convertToCSV(this.floodWeatherData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `flood_data_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export flood data');
        }
    }

    convertToCSV(data) {
        let csv = '';
        
        // Add headers
        if (data.hourly) {
            csv += 'Time,' + Object.keys(data.hourly).filter(key => key !== 'time').join(',') + '\n';
            
            // Add data rows
            const times = data.hourly.time || [];
            for (let i = 0; i < times.length; i++) {
                const row = [times[i]];
                Object.keys(data.hourly).forEach(key => {
                    if (key !== 'time') {
                        row.push(data.hourly[key][i] || '');
                    }
                });
                csv += row.join(',') + '\n';
            }
        } else if (data.daily) {
            csv += 'Time,' + Object.keys(data.daily).filter(key => key !== 'time').join(',') + '\n';
            
            const times = data.daily.time || [];
            for (let i = 0; i < times.length; i++) {
                const row = [times[i]];
                Object.keys(data.daily).forEach(key => {
                    if (key !== 'time') {
                        row.push(data.daily[key][i] || '');
                    }
                });
                csv += row.join(',') + '\n';
            }
        }
        
        return csv;
    }

    detectWeatherAnomalies(data) {
        if (!data.hourly) return;
        
        const temps = data.hourly.temperature_2m || [];
        const precip = data.hourly.precipitation || [];
        const wind = data.hourly.wind_speed_10m || [];
        
        // Temperature extremes
        const tempMean = temps.reduce((a, b) => a + b, 0) / temps.length;
        const tempStd = Math.sqrt(temps.reduce((sq, n) => sq + Math.pow(n - tempMean, 2), 0) / temps.length);
        const tempExtremes = temps.filter(t => Math.abs(t - tempMean) > 2 * tempStd);
        
        if (tempExtremes.length > 0) {
            this.tempExtremes.textContent = `${tempExtremes.length} extreme temperature events detected`;
        }
        
        // Precipitation events
        const heavyPrecip = precip.filter(p => p > 10); // > 10mm considered heavy
        if (heavyPrecip.length > 0) {
            this.precipEvents.textContent = `${heavyPrecip.length} heavy precipitation events`;
        }
        
        // Wind events
        const strongWind = wind.filter(w => w > 15); // > 15 m/s considered strong
        if (strongWind.length > 0) {
            this.windEvents.textContent = `${strongWind.length} strong wind events`;
        }
    }

    detectFloodAnomalies(data) {
        if (!data.daily) return;
        
        const discharge = data.daily.river_discharge || [];
        if (discharge.length === 0) return;
        
        const current = discharge[discharge.length - 1];
        const mean = discharge.reduce((a, b) => a + b, 0) / discharge.length;
        const std = Math.sqrt(discharge.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / discharge.length);
        const threshold = parseFloat(this.floodAlertThreshold?.value) || (mean + 2 * std);
        
        // Flood risk assessment
        const riskLevel = this.calculateFloodRisk(current, mean, std);
        this.floodRiskLevel.textContent = riskLevel;
        
        // Alert status
        if (current > threshold) {
            this.floodAlertStatus.textContent = 'ALERT: High Flow';
            this.floodAlertStatus.style.color = '#dc2626';
        } else {
            this.floodAlertStatus.textContent = 'Normal';
            this.floodAlertStatus.style.color = '#16a34a';
        }
        
        // Rising water detection
        const recentTrend = this.calculateTrend(discharge.slice(-7));
        if (recentTrend > 0.1) {
            this.risingWater.textContent = 'Rising water levels detected';
        } else {
            this.risingWater.textContent = 'No rising trend';
        }
        
        // High flow events
        const highFlowEvents = discharge.filter(d => d > mean + std);
        if (highFlowEvents.length > 0) {
            this.highFlowEvents.textContent = `${highFlowEvents.length} high flow events`;
        } else {
            this.highFlowEvents.textContent = 'No high flow events';
        }
        
        // Flow anomalies
        const anomalies = discharge.filter(d => Math.abs(d - mean) > 2 * std);
        if (anomalies.length > 0) {
            this.flowAnomalies.textContent = `${anomalies.length} flow anomalies detected`;
        } else {
            this.flowAnomalies.textContent = 'No anomalies detected';
        }
    }

    calculateFloodRisk(current, mean, std) {
        const zScore = (current - mean) / std;
        if (zScore > 3) return 'EXTREME';
        if (zScore > 2) return 'HIGH';
        if (zScore > 1) return 'MODERATE';
        return 'LOW';
    }

    calculateTrend(values) {
        if (values.length < 2) return 0;
        const n = values.length;
        const sumX = values.reduce((sum, _, i) => sum + i, 0);
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
        const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
    }

    // Enhanced Minutely Data Functions
    async updateMinutelyChart() {
        if (!this.currentCoords.lat || !this.currentCoords.lon) {
            this.showError('Please search for a location first');
            return;
        }

        this.showLoading();
        
        try {
            const hours = this.minutelyHours.value || '24';
            const variable = this.minutelyVariable.value || 'temperature_2m';
            const smoothing = this.minutelySmoothing.value || 'none';
            
            // Build hourly API URL for high-resolution data
            const hourlyUrl = `${this.baseUrl}/forecast?latitude=${this.currentCoords.lat}&longitude=${this.currentCoords.lon}&hourly=${variable}&timezone=auto`;
            
            console.log('Hourly URL:', hourlyUrl);
            
            const response = await fetch(hourlyUrl);
            if (!response.ok) {
                throw new Error(`Hourly API failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Hourly data received:', data);
            
            this.minutelyWeatherData = data;
            this.displayMinutelyData(data);
            this.drawMinutelyChart(data);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error fetching hourly data:', error);
            this.showError(`High-resolution data error: ${error.message}`);
            this.hideLoading();
        }
    }

    displayMinutelyData(data) {
        if (!data.hourly) return;
        
        const variable = this.minutelyVariable.value;
        const hours = parseInt(this.minutelyHours.value) || 24;
        const allValues = data.hourly[variable] || [];
        const allTimes = data.hourly.time || [];
        
        // Filter data based on selected time range
        const values = allValues.slice(-hours);
        const times = allTimes.slice(-hours);
        
        if (values.length === 0) return;
        
        const current = values[values.length - 1];
        const peak = Math.max(...values);
        const min = Math.min(...values);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        
        // Apply smoothing if selected
        let displayValues = values;
        if (this.minutelySmoothing.value === 'simple') {
            displayValues = this.applySimpleSmoothing(values);
        } else if (this.minutelySmoothing.value === 'exponential') {
            displayValues = this.applyExponentialSmoothing(values);
        }
        
        // Update summary elements
        if (this.minutelyCurrent) this.minutelyCurrent.textContent = `${current.toFixed(2)}${this.getMinutelyUnit(variable)}`;
        if (this.minutelyPeak) this.minutelyPeak.textContent = `${peak.toFixed(2)}${this.getMinutelyUnit(variable)}`;
        if (this.minutelyMin) this.minutelyMin.textContent = `${min.toFixed(2)}${this.getMinutelyUnit(variable)}`;
        if (this.minutelyAvg) this.minutelyAvg.textContent = `${avg.toFixed(2)}${this.getMinutelyUnit(variable)}`;
        
        console.log(`High-resolution Summary - Current: ${current.toFixed(2)}, Peak: ${peak.toFixed(2)}, Min: ${min.toFixed(2)}, Avg: ${avg.toFixed(2)}`);
    }

    drawMinutelyChart(data) {
        if (!this.minutelyChart) return;
        
        const ctx = this.minutelyChart.getContext('2d');
        const variable = this.minutelyVariable.value;
        const hours = parseInt(this.minutelyHours.value) || 24;
        
        let allValues = data.hourly[variable] || [];
        let allTimes = data.hourly.time || [];
        
        // Filter data based on selected time range
        let values = allValues.slice(-hours);
        let times = allTimes.slice(-hours);
        
        // Apply smoothing
        if (this.minutelySmoothing.value === 'simple') {
            values = this.applySimpleSmoothing(values);
        } else if (this.minutelySmoothing.value === 'exponential') {
            values = this.applyExponentialSmoothing(values);
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, this.minutelyChart.width, this.minutelyChart.height);
        
        if (values.length === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No high-resolution data available', this.minutelyChart.width / 2, this.minutelyChart.height / 2);
            ctx.textAlign = 'left';
            return;
        }
        
        const padding = 50;
        const chartWidth = this.minutelyChart.width - padding * 2;
        const chartHeight = this.minutelyChart.height - padding * 2;
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue;
        
        // Draw based on chart type
        if (this.currentChartType === 'line' || !this.currentChartType) {
            this.drawLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
        } else if (this.currentChartType === 'area') {
            this.drawMinutelyAreaChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
        } else if (this.currentChartType === 'scatter') {
            this.drawScatterChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
        }
        
        // Draw labels
        ctx.fillStyle = '#718096';
        ctx.font = '12px Arial';
        
        // X-axis labels (time)
        const labelInterval = Math.max(1, Math.floor(values.length / 10));
        for (let i = 0; i < values.length; i += labelInterval) {
            const time = new Date(times[i]);
            const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const x = padding + (i / (values.length - 1)) * chartWidth;
            ctx.fillText(timeStr, x - 30, this.minutelyChart.height - 20);
        }
        
        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (valueRange * i / 5);
            const y = padding + (1 - i / 5) * chartHeight;
            const unit = this.getMinutelyUnit(variable);
            ctx.fillText(`${value.toFixed(1)}${unit}`, 5, y + 3);
        }
        
        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Arial';
        const title = this.getMinutelyDisplayName(variable);
        ctx.fillText(`High-Resolution ${title}`, padding, padding - 20);
    }

    drawMinutelyAreaChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange) {
        // Draw filled area
        ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.beginPath();
        
        values.forEach((value, i) => {
            const x = padding + (i / (values.length - 1)) * chartWidth;
            const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, padding + chartHeight);
            else ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw line on top
        this.drawLineChart(ctx, values, times, padding, chartWidth, chartHeight, minValue, valueRange);
    }

    applySimpleSmoothing(values, windowSize = 3) {
        const smoothed = [];
        for (let i = 0; i < values.length; i++) {
            const start = Math.max(0, i - Math.floor(windowSize / 2));
            const end = Math.min(values.length, i + Math.floor(windowSize / 2) + 1);
            const window = values.slice(start, end);
            smoothed.push(window.reduce((a, b) => a + b, 0) / window.length);
        }
        return smoothed;
    }

    applyExponentialSmoothing(values, alpha = 0.3) {
        const smoothed = [values[0]];
        for (let i = 1; i < values.length; i++) {
            smoothed.push(alpha * values[i] + (1 - alpha) * smoothed[i - 1]);
        }
        return smoothed;
    }

    getMinutelyUnit(variable) {
        const units = {
            'temperature_2m': '°C',
            'relative_humidity_2m': '%',
            'precipitation': 'mm',
            'wind_speed_10m': 'km/h',
            'pressure_msl': 'hPa',
            'cloud_cover': '%',
            'shortwave_radiation': 'W/m²',
            'direct_radiation': 'W/m²',
            'diffuse_radiation': 'W/m²',
            'cape': 'J/kg',
            'vapour_pressure_deficit': 'kPa'
        };
        return units[variable] || '';
    }

    getMinutelyDisplayName(variable) {
        const names = {
            'temperature_2m': 'Temperature',
            'relative_humidity_2m': 'Relative Humidity',
            'precipitation': 'Precipitation',
            'wind_speed_10m': 'Wind Speed',
            'pressure_msl': 'Sea Level Pressure',
            'cloud_cover': 'Cloud Cover',
            'shortwave_radiation': 'Solar Radiation',
            'direct_radiation': 'Direct Radiation',
            'diffuse_radiation': 'Diffuse Radiation',
            'cape': 'CAPE (Storm Energy)',
            'vapour_pressure_deficit': 'Vapour Pressure Deficit'
        };
        return names[variable] || variable;
    }

    exportMinutelyData() {
        if (!this.minutelyWeatherData) {
            this.showError('No high-resolution data to export');
            return;
        }
        
        try {
            const csvContent = this.convertToCSV(this.minutelyWeatherData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `minutely_weather_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export high-resolution data');
        }
    }

    // Weather Maps Functions
    async updateWeatherMap() {
        if (!this.currentCoords.lat || !this.currentCoords.lon) {
            this.showError('Please search for a location first');
            return;
        }

        this.showLoading();
        
        try {
            const mapType = this.mapType.value || 'satellite';
            const animation = this.mapAnimation.value || 'none';
            const overlay = this.mapOverlay.value || 'none';
            
            // Simulate map loading (in real implementation, use weather map API)
            await this.simulateMapLoading(mapType, animation, overlay);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error updating weather map:', error);
            this.showError(`Map update error: ${error.message}`);
            this.hideLoading();
        }
    }

    async simulateMapLoading(mapType, animation, overlay) {
        // Show loading state
        if (this.mapViewer) {
            this.mapViewer.innerHTML = `
                <div class="map-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading ${mapType} map...</p>
                </div>
            `;
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear loading and show map
        if (this.mapViewer) {
            this.mapViewer.innerHTML = `
                <div class="map-canvas-container">
                    <canvas id="weatherMapCanvas" width="800" height="600"></canvas>
                </div>
            `;
        }
        
        // Get the new canvas element
        this.weatherMapCanvas = document.getElementById('weatherMapCanvas');
        
        // Draw simulated map on canvas
        if (this.weatherMapCanvas) {
            const ctx = this.weatherMapCanvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, this.weatherMapCanvas.width, this.weatherMapCanvas.height);
            
            // Draw background based on map type
            this.drawMapBackground(ctx, mapType);
            
            // Draw overlay if selected
            if (overlay !== 'none') {
                this.drawMapOverlay(ctx, overlay);
            }
            
            // Update legend
            this.updateMapLegend(mapType);
        }
    }

    drawMapBackground(ctx, mapType) {
        const width = this.weatherMapCanvas.width;
        const height = this.weatherMapCanvas.height;
        
        switch (mapType) {
            case 'satellite':
                // Simulate satellite view with gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(0.5, '#98FB98');
                gradient.addColorStop(1, '#228B22');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                break;
                
            case 'radar':
                // Simulate radar view
                ctx.fillStyle = '#000033';
                ctx.fillRect(0, 0, width, height);
                
                // Draw radar circles
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 1;
                for (let i = 1; i <= 5; i++) {
                    ctx.beginPath();
                    ctx.arc(width/2, height/2, i * 60, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
                
            case 'precipitation':
                // Simulate precipitation map
                ctx.fillStyle = '#F0F8FF';
                ctx.fillRect(0, 0, width, height);
                
                // Draw precipitation areas
                for (let i = 0; i < 10; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const size = Math.random() * 50 + 20;
                    
                    ctx.fillStyle = `rgba(0, 100, 255, ${Math.random() * 0.5 + 0.3})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'temperature':
                // Simulate temperature map
                const tempGradient = ctx.createLinearGradient(0, 0, width, 0);
                tempGradient.addColorStop(0, '#0000FF');
                tempGradient.addColorStop(0.5, '#00FF00');
                tempGradient.addColorStop(1, '#FF0000');
                ctx.fillStyle = tempGradient;
                ctx.fillRect(0, 0, width, height);
                break;
                
            case 'wind':
                // Simulate wind map with arrows
                ctx.fillStyle = '#F0F8FF';
                ctx.fillRect(0, 0, width, height);
                
                for (let i = 0; i < 15; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const angle = Math.random() * Math.PI * 2;
                    const length = Math.random() * 30 + 20;
                    
                    ctx.strokeStyle = '#4169E1';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
                    ctx.stroke();
                    
                    // Arrow head
                    ctx.beginPath();
                    ctx.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
                    ctx.lineTo(x + Math.cos(angle - 0.5) * (length - 10), y + Math.sin(angle - 0.5) * (length - 10));
                    ctx.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
                    ctx.lineTo(x + Math.cos(angle + 0.5) * (length - 10), y + Math.sin(angle + 0.5) * (length - 10));
                    ctx.stroke();
                }
                break;
                
            case 'pressure':
                // Simulate pressure map with isobars
                ctx.fillStyle = '#FFF8DC';
                ctx.fillRect(0, 0, width, height);
                
                for (let i = 0; i < 8; i++) {
                    const centerX = Math.random() * width;
                    const centerY = Math.random() * height;
                    const radius = Math.random() * 80 + 40;
                    
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Pressure value
                    ctx.fillStyle = '#8B4513';
                    ctx.font = '12px Arial';
                    const pressure = Math.floor(980 + Math.random() * 40);
                    ctx.fillText(`${pressure}hPa`, centerX - 20, centerY - radius - 5);
                }
                break;
                
            case 'clouds':
                // Simulate cloud cover map
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(0, 0, width, height);
                
                for (let i = 0; i < 12; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const size = Math.random() * 60 + 30;
                    const opacity = Math.random() * 0.7 + 0.3;
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(x - size * 0.3, y, size * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(x + size * 0.3, y, size * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            default:
                ctx.fillStyle = '#E0E0E0';
                ctx.fillRect(0, 0, width, height);
        }
    }

    drawMapOverlay(ctx, overlay) {
        const width = this.weatherMapCanvas.width;
        const height = this.weatherMapCanvas.height;
        
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        
        switch (overlay) {
            case 'cities':
                // Draw city markers
                const cities = [
                    { x: width * 0.3, y: height * 0.4, name: 'City A' },
                    { x: width * 0.6, y: height * 0.3, name: 'City B' },
                    { x: width * 0.5, y: height * 0.6, name: 'City C' }
                ];
                
                cities.forEach(city => {
                    ctx.fillStyle = '#FF0000';
                    ctx.beginPath();
                    ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.fillText(city.name, city.x + 10, city.y - 5);
                });
                break;
                
            case 'borders':
                // Draw country borders
                ctx.beginPath();
                ctx.moveTo(width * 0.2, height * 0.2);
                ctx.lineTo(width * 0.8, height * 0.2);
                ctx.lineTo(width * 0.8, height * 0.8);
                ctx.lineTo(width * 0.2, height * 0.8);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'rivers':
                // Draw rivers
                ctx.strokeStyle = '#4682B4';
                ctx.lineWidth = 3;
                
                // Main river
                ctx.beginPath();
                ctx.moveTo(width * 0.1, height * 0.1);
                ctx.quadraticCurveTo(width * 0.3, height * 0.4, width * 0.5, height * 0.5);
                ctx.quadraticCurveTo(width * 0.7, height * 0.6, width * 0.9, height * 0.9);
                ctx.stroke();
                
                // Tributary
                ctx.strokeStyle = '#6495ED';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(width * 0.3, height * 0.2);
                ctx.quadraticCurveTo(width * 0.4, height * 0.35, width * 0.5, height * 0.5);
                ctx.stroke();
                break;
                
            case 'roads':
                // Draw major roads
                ctx.strokeStyle = '#708090';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                
                // Highway 1
                ctx.beginPath();
                ctx.moveTo(width * 0.1, height * 0.5);
                ctx.lineTo(width * 0.9, height * 0.5);
                ctx.stroke();
                
                // Highway 2
                ctx.beginPath();
                ctx.moveTo(width * 0.5, height * 0.1);
                ctx.lineTo(width * 0.5, height * 0.9);
                ctx.stroke();
                
                ctx.setLineDash([]);
                break;
        }
    }

    updateMapLegend(mapType) {
        if (!this.legendItems) return;
        
        const legends = {
            'satellite': [
                { color: '#87CEEB', label: 'Clear Sky' },
                { color: '#98FB98', label: 'Vegetation' },
                { color: '#228B22', label: 'Dense Forest' }
            ],
            'radar': [
                { color: '#00FF00', label: 'Radar Range' },
                { color: '#FFFF00', label: 'Precipitation' }
            ],
            'precipitation': [
                { color: '#0066FF', label: 'Light Rain' },
                { color: '#0033CC', label: 'Heavy Rain' },
                { color: '#000099', label: 'Storm' }
            ],
            'temperature': [
                { color: '#0000FF', label: 'Cold (<0°C)' },
                { color: '#00FF00', label: 'Moderate (10-20°C)' },
                { color: '#FF0000', label: 'Hot (>30°C)' }
            ],
            'wind': [
                { color: '#4169E1', label: 'Wind Direction' },
                { color: '#87CEEB', label: 'Light Breeze' },
                { color: '#000080', label: 'Strong Winds' }
            ],
            'pressure': [
                { color: '#8B4513', label: 'Isobars' },
                { color: '#FFD700', label: 'High Pressure' },
                { color: '#4169E1', label: 'Low Pressure' }
            ],
            'clouds': [
                { color: '#FFFFFF', label: 'Clear Skies' },
                { color: '#D3D3D3', label: 'Partly Cloudy' },
                { color: '#696969', label: 'Overcast' }
            ]
        };
        
        const currentLegend = legends[mapType] || [];
        
        this.legendItems.innerHTML = currentLegend.map(item => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${item.color};"></div>
                <span>${item.label}</span>
            </div>
        `).join('');
    }

    toggleMapFullscreen() {
        if (!this.weatherMapCanvas) return;
        
        if (!document.fullscreenElement) {
            this.weatherMapCanvas.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Weather Animations Functions
    updateAnimationPreview() {
        const animationType = this.animationType.value || 'none';
        const intensity = this.animationIntensity.value || 5;
        
        if (this.animationCanvas) {
            this.drawAnimationPreview(animationType, intensity);
        }
    }

    drawAnimationPreview(animationType, intensity) {
        const ctx = this.animationCanvas.getContext('2d');
        const width = this.animationCanvas.width;
        const height = this.animationCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        switch (animationType) {
            case 'particles':
                this.drawParticleAnimation(ctx, width, height, intensity);
                break;
            case 'rain':
                this.drawRainAnimation(ctx, width, height, intensity);
                break;
            case 'snow':
                this.drawSnowAnimation(ctx, width, height, intensity);
                break;
            case 'lightning':
                this.drawLightningAnimation(ctx, width, height, intensity);
                break;
            case 'clouds':
                this.drawCloudAnimation(ctx, width, height, intensity);
                break;
            case 'aurora':
                this.drawAuroraAnimation(ctx, width, height, intensity);
                break;
            default:
                ctx.fillStyle = '#F0F0F0';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#666666';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No Animation', width/2, height/2);
                ctx.textAlign = 'left';
        }
    }

    drawParticleAnimation(ctx, width, height, intensity) {
        const particleCount = intensity * 5;
        
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawRainAnimation(ctx, width, height, intensity) {
        const dropCount = intensity * 10;
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < dropCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = Math.random() * 20 + 10;
            
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + length);
            ctx.stroke();
        }
    }

    drawSnowAnimation(ctx, width, height, intensity) {
        const flakeCount = intensity * 8;
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < flakeCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 2;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawLightningAnimation(ctx, width, height, intensity) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw lightning bolts
        for (let i = 0; i < intensity / 2; i++) {
            const startX = Math.random() * width;
            const startY = 0;
            const endX = startX + (Math.random() - 0.5) * 100;
            const endY = height;
            
            ctx.strokeStyle = 'rgba(255, 255, 100, 0.9)';
            ctx.lineWidth = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Add glow effect
            ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
            ctx.lineWidth = 8;
            ctx.stroke();
        }
    }

    drawCloudAnimation(ctx, width, height, intensity) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < intensity; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.6;
            const size = Math.random() * 60 + 40;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x - size * 0.3, y, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x + size * 0.3, y, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawAuroraAnimation(ctx, width, height, intensity) {
        // Dark background
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, width, height);
        
        // Draw aurora bands
        for (let i = 0; i < intensity; i++) {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            
            const hue = Math.random() * 60 + 120; // Green to yellow range
            gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0)`);
            gradient.addColorStop(0.5, `hsla(${hue}, 100%, 70%, 0.3)`);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            const startX = Math.random() * width;
            const amplitude = Math.random() * 100 + 50;
            
            for (let y = 0; y <= height; y += 5) {
                const x = startX + Math.sin(y * 0.02) * amplitude;
                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            
            ctx.closePath();
            ctx.fill();
        }
    }

    updateIntensityDisplay() {
        if (this.intensityValue && this.animationIntensity) {
            this.intensityValue.textContent = this.animationIntensity.value;
        }
    }

    updateBackgroundTheme() {
        const theme = this.backgroundTheme.value || 'default';
        document.body.className = `theme-${theme}`;
    }

    toggleAutoAnimations() {
        if (this.autoAnimations.checked) {
            this.applyWeatherAnimations();
        }
    }

    applyWeatherAnimations() {
        const animationType = this.animationType.value || 'none';
        const intensity = this.animationIntensity.value || 5;
        
        // Apply animations to main background
        this.applyBackgroundAnimation(animationType, intensity);
    }

    applyBackgroundAnimation(animationType, intensity) {
        // In a real implementation, this would create persistent animations
        console.log(`Applying ${animationType} animation with intensity ${intensity}`);
    }

    resetAnimations() {
        this.animationType.value = 'none';
        this.animationIntensity.value = 5;
        this.backgroundTheme.value = 'default';
        this.autoAnimations.checked = false;
        
        this.updateIntensityDisplay();
        this.updateBackgroundTheme();
        this.updateAnimationPreview();
    }

    // Ensemble Weather Models Functions
    async updateEnsembleComparison() {
        if (!this.currentCoords.lat || !this.currentCoords.lon) {
            this.showError('Please search for a location first');
            return;
        }

        this.showLoading();
        
        try {
            const selectedModels = Array.from(this.ensembleModels.selectedOptions).map(option => option.value);
            const variable = this.ensembleVariable.value || 'temperature_2m';
            const forecastHours = this.ensembleForecast.value || '24';
            
            // Build ensemble API URLs for each model
            const ensembleData = {};
            
            for (const model of selectedModels) {
                const url = `${this.baseUrl}?latitude=${this.currentCoords.lat}&longitude=${this.currentCoords.lon}&hourly=${variable}&forecast_hours=${forecastHours}&models=${model}&timezone=auto`;
                
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    ensembleData[model] = data;
                }
            }
            
            this.ensembleWeatherData = ensembleData;
            this.displayEnsembleComparison(ensembleData);
            this.drawEnsembleChart(ensembleData);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error fetching ensemble data:', error);
            this.showError(`Ensemble comparison error: ${error.message}`);
            this.hideLoading();
        }
    }

    displayEnsembleComparison(ensembleData) {
        const models = Object.keys(ensembleData);
        if (models.length === 0) return;
        
        // Calculate model agreement statistics
        const variable = this.ensembleVariable.value;
        const allValues = [];
        const modelAverages = {};
        
        models.forEach(model => {
            const values = ensembleData[model].hourly[variable] || [];
            modelAverages[model] = values.reduce((a, b) => a + b, 0) / values.length;
            allValues.push(...values);
        });
        
        const overallMean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
        const overallStd = Math.sqrt(allValues.reduce((sq, n) => sq + Math.pow(n - overallMean, 2), 0) / allValues.length);
        
        // Find consensus
        const consensus = models.find(model => 
            Math.abs(modelAverages[model] - overallMean) < overallStd * 0.5
        ) || models[0];
        
        // Find high uncertainty periods
        const highUncertainty = allValues.filter((val, i) => 
            Math.abs(val - overallMean) > overallStd * 2
        ).length;
        
        // Update summary elements
        if (this.modelConsensus) this.modelConsensus.textContent = consensus || 'No clear consensus';
        if (this.highUncertainty) this.highUncertainty.textContent = `${highUncertainty} high uncertainty periods`;
        if (this.mostLikely) this.mostLikely.textContent = `${overallMean.toFixed(2)}${this.getEnsembleUnit(variable)}`;
        
        console.log(`Ensemble Analysis - Consensus: ${consensus}, High Uncertainty: ${highUncertainty}, Most Likely: ${overallMean.toFixed(2)}`);
    }

    drawEnsembleChart(ensembleData) {
        if (!this.ensembleChart) return;
        
        const ctx = this.ensembleChart.getContext('2d');
        const models = Object.keys(ensembleData);
        const variable = this.ensembleVariable.value;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.ensembleChart.width, this.ensembleChart.height);
        
        if (models.length === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No ensemble data available', this.ensembleChart.width / 2, this.ensembleChart.height / 2);
            ctx.textAlign = 'left';
            return;
        }
        
        const padding = 50;
        const chartWidth = this.ensembleChart.width - padding * 2;
        const chartHeight = this.ensembleChart.height - padding * 2;
        const colors = ['#4299e1', '#667eea', '#48bb78', '#ed8936', '#9f7aea'];
        
        // Draw spaghetti plot
        this.drawSpaghettiPlot(ctx, ensembleData, variable, padding, chartWidth, chartHeight, colors);
        
        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Arial';
        const title = this.getEnsembleDisplayName(variable);
        ctx.fillText(`Ensemble ${title}`, padding, padding - 20);
    }

    drawSpaghettiPlot(ctx, ensembleData, variable, padding, chartWidth, chartHeight, colors) {
        const models = Object.keys(ensembleData);
        let allValues = [];
        
        models.forEach((model, index) => {
            const values = ensembleData[model].hourly[variable] || [];
            allValues.push(...values);
            
            ctx.strokeStyle = colors[index % colors.length];
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            values.forEach((value, i) => {
                const x = padding + (i / (values.length - 1)) * chartWidth;
                const y = padding + (1 - (value - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues))) * chartHeight;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            
            ctx.stroke();
        });
    }

    drawEnsembleLines(ctx, ensembleData, variable, padding, chartWidth, chartHeight, colors) {
        const models = Object.keys(ensembleData);
        let allValues = [];
        
        // Calculate ensemble mean and spread
        const timePoints = ensembleData[models[0]].hourly[variable].length;
        const ensembleMeans = [];
        const ensembleSpreads = [];
        
        for (let i = 0; i < timePoints; i++) {
            const pointValues = models.map(model => ensembleData[model].hourly[variable][i]);
            const mean = pointValues.reduce((a, b) => a + b, 0) / pointValues.length;
            const spread = Math.sqrt(pointValues.reduce((sq, val) => sq + Math.pow(val - mean, 2), 0) / pointValues.length);
            
            ensembleMeans.push(mean);
            ensembleSpreads.push(spread);
            allValues.push(mean);
        }
        
        // Draw ensemble mean
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        ensembleMeans.forEach((mean, i) => {
            const x = padding + (i / (ensembleMeans.length - 1)) * chartWidth;
            const y = padding + (1 - (mean - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues))) * chartHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Draw confidence bands
        if (this.ensembleSpread?.checked) {
            ctx.fillStyle = 'rgba(66, 153, 225, 0.2)';
            ctx.beginPath();
            
            ensembleMeans.forEach((mean, i) => {
                const x = padding + (i / (ensembleMeans.length - 1)) * chartWidth;
                const upperY = padding + (1 - ((mean + ensembleSpreads[i]) - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues))) * chartHeight;
                const lowerY = padding + (1 - ((mean - ensembleSpreads[i]) - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues))) * chartHeight;
                
                if (i === 0) ctx.moveTo(x, upperY);
                else ctx.lineTo(x, upperY);
            });
            
            for (let i = ensembleMeans.length - 1; i >= 0; i--) {
                const x = padding + (i / (ensembleMeans.length - 1)) * chartWidth;
                const lowerY = padding + (1 - ((ensembleMeans[i] - ensembleSpreads[i]) - Math.min(...allValues)) / (Math.max(...allValues) - Math.min(...allValues))) * chartHeight;
                ctx.lineTo(x, lowerY);
            }
            
            ctx.closePath();
            ctx.fill();
        }
    }

    getEnsembleUnit(variable) {
        const units = {
            'temperature_2m': '°C',
            'precipitation': 'mm',
            'wind_speed_10m': 'km/h',
            'pressure_msl': 'hPa',
            'cloud_cover': '%'
        };
        return units[variable] || '';
    }

    getEnsembleDisplayName(variable) {
        const names = {
            'temperature_2m': 'Temperature',
            'precipitation': 'Precipitation',
            'wind_speed_10m': 'Wind Speed',
            'pressure_msl': 'Sea Level Pressure',
            'cloud_cover': 'Cloud Cover'
        };
        return names[variable] || variable;
    }

    exportEnsembleData() {
        if (!this.ensembleWeatherData) {
            this.showError('No ensemble data to export');
            return;
        }
        
        try {
            let csvContent = 'Model,Time,Value\n';
            
            Object.entries(this.ensembleWeatherData).forEach(([model, data]) => {
                const variable = this.ensembleVariable.value;
                const values = data.hourly[variable] || [];
                const times = data.hourly.time || [];
                
                values.forEach((value, i) => {
                    csvContent += `${model},${times[i]},${value}\n`;
                });
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ensemble_comparison_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export ensemble data');
        }
    }

    // Settings functionality
    openSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('hidden');
        this.loadSettings();
    }

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('hidden');
    }

    loadSettings() {
        // Load settings from localStorage
        const settings = JSON.parse(localStorage.getItem('weatherPulseSettings')) || this.getDefaultSettings();
        
        // Apply settings to form elements
        document.getElementById('tempUnit').value = settings.tempUnit;
        document.getElementById('windUnit').value = settings.windUnit;
        document.getElementById('pressureUnit').value = settings.pressureUnit;
        document.getElementById('timeFormat').value = settings.timeFormat;
        document.getElementById('dateFormat').value = settings.dateFormat;
        document.getElementById('theme').value = settings.theme;
        document.getElementById('animations').value = settings.animations;
        document.getElementById('defaultLocation').value = settings.defaultLocation;
        document.getElementById('language').value = settings.language;
        document.getElementById('refreshInterval').value = settings.refreshInterval;
        
        document.getElementById('weatherAlerts').checked = settings.weatherAlerts;
        document.getElementById('dailyForecast').checked = settings.dailyForecast;
        document.getElementById('severeWeather').checked = settings.severeWeather;
        document.getElementById('cacheData').checked = settings.cacheData;
        document.getElementById('shareData').checked = settings.shareData;
    }

    getDefaultSettings() {
        return {
            tempUnit: 'celsius',
            windUnit: 'kmh',
            pressureUnit: 'hpa',
            timeFormat: '24h',
            dateFormat: 'dd/mm/yyyy',
            theme: 'light',
            animations: 'enabled',
            defaultLocation: '',
            language: 'en',
            refreshInterval: '0',
            weatherAlerts: false,
            dailyForecast: false,
            severeWeather: true,
            cacheData: true,
            shareData: false
        };
    }

    saveSettings() {
        const settings = {
            tempUnit: document.getElementById('tempUnit').value,
            windUnit: document.getElementById('windUnit').value,
            pressureUnit: document.getElementById('pressureUnit').value,
            timeFormat: document.getElementById('timeFormat').value,
            dateFormat: document.getElementById('dateFormat').value,
            theme: document.getElementById('theme').value,
            animations: document.getElementById('animations').value,
            defaultLocation: document.getElementById('defaultLocation').value,
            language: document.getElementById('language').value,
            refreshInterval: document.getElementById('refreshInterval').value,
            weatherAlerts: document.getElementById('weatherAlerts').checked,
            dailyForecast: document.getElementById('dailyForecast').checked,
            severeWeather: document.getElementById('severeWeather').checked,
            cacheData: document.getElementById('cacheData').checked,
            shareData: document.getElementById('shareData').checked
        };
        
        localStorage.setItem('weatherPulseSettings', JSON.stringify(settings));
        this.applySettings(settings);
        this.closeSettings();
        this.showNotification('Settings saved successfully!');
    }

    applySettings(settings) {
        // Apply theme
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Apply animations
        if (settings.animations === 'disabled') {
            document.body.classList.add('no-animations');
        } else if (settings.animations === 'reduced') {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('no-animations', 'reduced-motion');
        }
        
        // Set up auto refresh
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        const interval = parseInt(settings.refreshInterval);
        if (interval > 0 && this.currentCoords) {
            this.refreshTimer = setInterval(() => {
                this.getWeatherByCoords(
                    this.currentCoords.lat,
                    this.currentCoords.lon,
                    this.currentCity,
                    this.currentCountry
                );
            }, interval * 60 * 1000);
        }
        
        // Load default location if set
        if (settings.defaultLocation && !this.currentCity) {
            this.getWeatherByCity(settings.defaultLocation);
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            localStorage.removeItem('weatherPulseSettings');
            this.loadSettings();
            this.applySettings(this.getDefaultSettings());
            this.showNotification('Settings reset to default!');
        }
    }

    exportSettings() {
        const settings = JSON.parse(localStorage.getItem('weatherPulseSettings')) || this.getDefaultSettings();
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'weatherpulse-settings.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const settings = JSON.parse(event.target.result);
                        localStorage.setItem('weatherPulseSettings', JSON.stringify(settings));
                        this.loadSettings();
                        this.applySettings(settings);
                        this.showNotification('Settings imported successfully!');
                    } catch (error) {
                        this.showNotification('Error importing settings: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new WeatherDashboard();
    
    // Add settings event listeners
    document.getElementById('closeSettings').addEventListener('click', () => dashboard.closeSettings());
    document.getElementById('saveSettings').addEventListener('click', () => dashboard.saveSettings());
    document.getElementById('resetSettings').addEventListener('click', () => dashboard.resetSettings());
    document.getElementById('exportSettings').addEventListener('click', () => dashboard.exportSettings());
    document.getElementById('importSettings').addEventListener('click', () => dashboard.importSettings());
    
    // Close modal when clicking outside
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            dashboard.closeSettings();
        }
    });
});

// Note: This dashboard uses Open-Meteo API which is completely free and requires no API key
// Open-Meteo provides comprehensive weather data including current conditions, hourly forecasts, 
// daily forecasts, and advanced weather metrics without any registration required
// API documentation: https://open-meteo.com/en/docs
