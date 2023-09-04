// Select the form using its ID
const weatherForm = document.getElementById("weatherSearch");
const searchResultsDiv = document.getElementById("searchResults");
var pastSearches = new Array(10);
const weatherAPIKey = "22416836bfaaf9b43c5d9d1c14bbb7ff";

// Add an event listener to the form
weatherForm.addEventListener("submit", function (event) {
  // Prevent the form from refreshing the page
  event.preventDefault();

  // Get the city entered by the user
  const city = document.getElementById("searchCity").value;
  if (pastSearches.length >= 10) {
    pastSearches.shift();
  }
  pastSearches.push(city);

  displayPreviousSearch();
  // Fetch weather data for the city (this is just a placeholder, you'll need to use an actual API)
  fetchWeatherData(city);
});

function fetchWeatherData(city) {
  let locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherAPIKey}`;
  fetch(locationUrl)
    .then((response) => response.json())
    .then((data) => {
      let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${weatherAPIKey}&units=metric`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          displayResults(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayPreviousSearch() {
  searchResultsDiv.innerHTML = ""; // Clear previous results

  if (pastSearches.length > 0) {
    pastSearches.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.textContent = item; // Adjust based on the actual data structure
      searchResultsDiv.appendChild(itemDiv);
    });
  } else {
    searchResultsDiv.textContent = "No results found";
  }
}

function displayResults(data) {
  let currentWeather = data.list[0];

  updateCurrentWeatherDisplay(data.city.name, currentWeather);
  updateForecast(data);
}

function updateForecast(data) {
  weatherAtNoon = getWeatherAtNoon(data);

  $("#forecastData > div").remove();

  for (var i = 1; i < weatherAtNoon.length; i++) {
    let weatherDiv = createWeatherDiv(weatherAtNoon[i]);
    $("#forecastData").append(weatherDiv);
  }
}

function updateCurrentWeatherDisplay(cityName, currentWeather) {
  $("#cityDate").text(cityName);
  $("#temp").text("Temp: " + currentWeather.main.temp + "°C");
}

function createWeatherDiv(weatherItem, id) {
  let div = document.createElement("div");
  div.classList.add(id);

  let date = document.createElement("p");
  let icon = document.createElement("p");
  let temp = document.createElement("p");
  let wind = document.createElement("p");
  let humidity = document.createElement("p");

  date.textContent = formatDate(weatherItem.dt);

  div.appendChild(date);

  return div;
}

function getWeatherAtNoon(response) {
  const today = new Date().toISOString().split("T")[0];
  const results = [];

  // Today's weather
  results.push(response.list[0]);

  // Weather for subsequent days at noon
  for (let item of response.list) {
    if (item.dt_txt.includes("12:00:00") && !item.dt_txt.includes(today)) {
      results.push(item);
    }
  }

  return results;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
