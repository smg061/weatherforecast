const APIkey = "9be6f9b4f8a5410772929791cbfce1fa"
var cities = [];
var UVlight; // global variable hackiness because I don't have time for proper debugging

// function that fetches the weather for the requested city
function getTodaysWeather(cityToSearch)
{
    var fetchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch  + "&appid=" + APIkey + "&units=imperial";
    fetch(fetchURL)
    //regular fetch call
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
        // verify the data in the console
        console.log(weatherData);
        // get the humidity and temp data from the returned object
        var humidity = weatherData.main.humidity;
        var temperature = weatherData.main.temp;
        // today's date
        var date = new Date().toLocaleDateString()
        // get the UVIndex
        getUVIndex(weatherData.coord.lat, weatherData.coord.lon);
        // create today's weather panel with a call to the createTopPanel function and append it 
        forecastEl = createTopPanel(cityToSearch, date, humidity, temperature);
        $("#today").append(forecastEl);

    }

)}

// sub function that gets UV exposure; note: I never got the function to properly return a value
function getUVIndex(lat, lon)
{
    var fetchURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;
    fetch(fetchURL)
    .then(function(response)
    {
        return response.json();
    })
    .then(function(data)
    {
        console.log(data.value);
        $(".badge").text(`UV index: ${data.value}`)
        //UVlight = data.value; //terrible way to get the uvdata, but for some reason returning data.value ALWAYS will return undefined and this is a hacky solution
    }

)}
    
// function that fetches the 5 day forecast 
function getForecast(cityToSearch)
{
    // regular fetch call
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
            // verify data 
            console.log(weatherData);
            // header for the forecast 
            forecastTextEl = $("<div>", {class: "card", text: "5-Day Forecast: "})
            $('#forecast').append(forecastTextEl);
            // loop through the 5 days of forecast. creating a weather card for each
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


function createTopPanel(cityToSearch, date, humidity, temperature, UV)
{
    var forecastEl = $("<div>", {
        class: "card"
    })
    // create elements necessary for the top panel and add the appropriate text to them
    var forecastTitle = $("<h4>", {class: "card-title"});
    forecastTitle.text(`${cityToSearch}  (${date})`);
    var tempEl = $("<p>", {class: "card-text"});
    var humidityEl = $("<p>", {class: "card-text"});
    var UVEl = $("<p>", {class: "card-text"});
    var UVbadge = $("<span>", {class: "badge badge-danger"})     
    tempEl.text(`Temp: ${temperature}°F`)
    humidityEl.text(`Humidity: ${humidity}%`)
    //UVbadge.text(`UV Index ${UV}`);
    UVEl.append(UVbadge)
    forecastEl.append(forecastTitle)
    forecastEl.append(tempEl)
    forecastEl.append(humidityEl);
    forecastEl.append(UVEl)
    // return the top panel
    return forecastEl
}

function createWeatherPanel(windSpeed, humidity, temperature, image, date)
{   //containers for the temp panel
    var headerEl = $("<h5>", {class: "card-title"})    
    cardEl = $("<div>", {class: "card bg-primary", id: "weather-card"})
    var bodyEl = $("<div>", {class: "card-body p-2"})
    var columnEl = $("<div>", {class:"col"});
    // create elements to display temperature, humidity and wind
    headerEl.text(date);
    var windEl = $("<p>", {class: "card-text"});
    windEl.text("Wind Speed: " +  windSpeed + "MPH");
    var humidityEl = $("<p>", {class: "card-text"});
    humidityEl.text("Humidity: " + humidity + "%" );
    var tempEl = $("<p>", {class: "card-text"})
    tempEl.text("Temp: " + temperature + " °F")
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

// function that retrieves the text from the search box
function getSearchValue()
{
    var searchText = $("#search-value").val();
    console.log(searchText)
    return searchText;
}

// function that appends a city list item to the side bar
function addCityToList(city)
{
    
    var cityAppendEl = $("<li>", {class:"list-group-item list-group-item-action", id:"history-item"});
    cityAppendEl.text(city);
    $("#history").append(cityAppendEl);
}

function saveCityToLocalStorage(city)
{
    // add the city to the cities array and save it to local storage
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

function getCitiesFromLocalStorage()
{
    cities = [];
    var storedCities = JSON.parse(localStorage.getItem("cities"))
    // set the local cities array to the search history stored in local storage
    if (storedCities != undefined)
    {
        cities = storedCities;
    }
}

function renderCityElements()
{
    // loop through all the saved searches and render them to the page 
    if (cities.length > 0) 
    {
        for (var city of cities)
        {
            var cityAppendEl = $("<li>", {class:"list-group-item list-group-item-action", id: "history-item"});
            cityAppendEl.text(city);
            $("#history").append(cityAppendEl);
        }
    }
}

function main(cityToSearch)
{   // completely clear todays weather adn the weather forecast elements
    $("#today").html("");
    $("#forecast").html("");
    // only search if there is text in the box
    if (cityToSearch != "")
    {
        getTodaysWeather(cityToSearch);
        getForecast(cityToSearch);

        
    }

}

// retrieve and render the search history onto the page
getCitiesFromLocalStorage();
renderCityElements();
// execute main function on click of search and clicking history elements

$("#history").children("#history-item").on("click", function(event)
{
    cityToSearch = $(this).text();
    console.log(cityToSearch)
    main(cityToSearch)

})

$("#search-button").on("click" , function(event)
{
    var cityToSearch = getSearchValue();
    main(cityToSearch);
    // only save a city to history if it's not already there
    if(cities.indexOf(cityToSearch) === -1)
    {
        addCityToList(cityToSearch);
        saveCityToLocalStorage(cityToSearch)
    }
    getCitiesFromLocalStorage();
    renderCityElements();
});

