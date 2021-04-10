

function getForecast(cityToSearch)
{
    var APIkey = "9be6f9b4f8a5410772929791cbfce1fa"
    var fetchURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityToSearch  + "&appid=" +APIkey + "&units=imperial";
    fetch(fetchURL)
        .then(function(response)
        {
            if (!response.ok)
            {
                throw response.json();
            }

            return response.json();

        })
        .then(function(weatherData)
        {
            console.log(weatherData);
            forecastEl = $("<h3>", {
                class: "mt-3"
            })
            forecastEl.text("5-Day Forecast:")
            $("#forecast").append(forecastEl);
    
            for (var i = 0; i < weatherData.list.length; i++)
            {
                if (weatherData.list[i].dt_txt.indexOf('15:00:00') !== -1)
                {  
                    var windSpeed = weatherData.list[i].wind.speed;
                    var humidity  = weatherData.list[i].main.humidity;
                    var temperature = weatherData.list[i].main.temp_max;
                    date = new Date(weatherData.list[i].dt_txt);
                    
                    var weatherPanel = createWeatherPanel(windSpeed, humidity, temperature)
                    forecastEl.append(weatherPanel);
                }
    
            }

        })

}

function createWeatherPanel(windSpeed, humidity, temperature, date)
{   //containers for the temp panel
    var bodyEl = $("<div>", {class: "card-body p-2"})
    cardEl = $("<div>", {class: "card"})
    var columnEl = $("<div>", {class:"col"});

    // create elements to display temperature, humidity and wind
    var headerEl = $("<h5>", {class: "card-title"})
    headerEl.text(date);
    var windEl = $("<p>", {class: "card-text"});
    windEl.text("Wind Speed: " +  windSpeed);
    var humidityEl = $("<p>", {class: "card-text"});
    humidityEl.text("Humidity: " + humidity );
    var tempEl = $("<p>", {class: "card-text"})
    tempEl.text("Temp: " + temperature + " F")
    tempEl.text(date)
    bodyEl.append(headerEl);
    bodyEl.append(windEl);
    bodyEl.append(humidityEl);
    bodyEl.append(tempEl);
    cardEl.append(bodyEl)
    columnEl.append(cardEl);
    return columnEl
    
}
 
getForecast("Houston");


