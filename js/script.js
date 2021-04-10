const APIkey = "9be6f9b4f8a5410772929791cbfce1fa"
var cities = [];
function getTodaysWeather(cityToSearch)
{
    var fetchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch  + "&appid=" + APIkey + "&units=imperial";
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
        var humidity = weatherData.main.humidity;
        var temperature = weatherData.main.temp;
        var date = new Date().toLocaleDateString()
        forecastEl = createTopPanel(cityToSearch, date, humidity, temperature);
        $("#today").append(forecastEl);

    }

)}
    

function getForecast(cityToSearch)
{
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

            for (var i = 0; i < weatherData.list.length; i++)
            {
                if (weatherData.list[i].dt_txt.indexOf('15:00:00') !== -1)
                {  
                    var windSpeed = weatherData.list[i].wind.speed;
                    var humidity  = weatherData.list[i].main.humidity;
                    var temperature = weatherData.list[i].main.temp_max;
                    var image  = weatherData.list[i].weather[0].icon;
                    date = new Date(weatherData.list[i].dt_txt).toLocaleDateString();
                    var weatherPanel = createWeatherPanel(windSpeed, humidity, temperature, image, date)
                    $("#forecast").append(weatherPanel);
                }
            }
        })
}


function createTopPanel(cityToSearch, date, humidity, temperature)
{
    var forecastEl = $("<div>", {
        class: "card"
    })
    var forecastTitle = $("<h4>", {class: "card-title"});
    forecastTitle.text(`${cityToSearch}  (${date})`)
    var tempEl = $("<p>", {class: "card-text"})
    tempEl.text(humidity + "\n" + temperature)
    forecastEl.append(forecastTitle)
    forecastEl.append(tempEl)
    return forecastEl
}


function createWeatherPanel(windSpeed, humidity, temperature, image, date)
{   //containers for the temp panel
    var headerEl = $("<h5>", {class: "card-title"})    
    cardEl = $("<div>", {class: "card bg-primary"})
    var bodyEl = $("<div>", {class: "card-body p-2"})
    var columnEl = $("<div>", {class:"col"});
    // create elements to display temperature, humidity and wind
    headerEl.text(date);
    var windEl = $("<p>", {class: "card-text"});
    windEl.text("Wind Speed: " +  windSpeed + "MPH");
    var humidityEl = $("<p>", {class: "card-text"});
    humidityEl.text("Humidity: " + humidity + "%" );
    var tempEl = $("<p>", {class: "card-text"})
    tempEl.text("Temp: " + temperature + " F")
    imgEl = $("<img>", {src:"http://openweathermap.org/img/w/" + image + ".png" })
    // put together all the elements
    bodyEl.append(imgEl)
    bodyEl.append(headerEl);
    bodyEl.append(windEl);
    bodyEl.append(humidityEl);
    bodyEl.append(tempEl);
    cardEl.append(bodyEl)
    columnEl.append(cardEl);
    return columnEl
    
}

function getSearchValue()
{
    var searchText = $("#search-value").val();
    console.log(searchText)
    return searchText;
}

function addCityToList(city)
{
    var cityAppendEl = $("<li>", {class:"list-group-item list-group-item-action"});
    cityAppendEl.text(city);
    $("#history").append(cityAppendEl);

}

function saveCityToLocalStorage(city)
{
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));

}

function getCitiesFromLocalStorage()
{
    var storedCities = JSON.parse(localStorage.getItem("cities"))
    if (storedCities != null && storedCities != undefined)
    {
        cities = storedCities;
    }

}

function renderCityElements()
{
    if (cities.length > 0) 
    {
        for (var city of cities)
        {
            var cityAppendEl = $("<li>", {class:"list-group-item list-group-item-action"});
            cityAppendEl.text(city);
            $("#history").append(cityAppendEl);

        }

    }

}

function main(cityToSearch)
{
    if (cityToSearch != "")
    {
        getTodaysWeather(cityToSearch);
        getForecast(cityToSearch);

        if(cities.indexOf(cityToSearch) === -1)
        {
            addCityToList(cityToSearch);
            saveCityToLocalStorage(cityToSearch)
        }
    }

}

getCitiesFromLocalStorage();
renderCityElements()

$("#search-button").on("click" , function(event)
{
    event.preventDefault();
    $("#today").html("");
    $("#forecast").html("");
    cityToSearch = getSearchValue();
    main(cityToSearch);

});

$("#history")
