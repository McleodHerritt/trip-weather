// Initialize DOM elements and retrieve past searches from localStorage
const weatherForm = document.getElementById("weatherSearch");
const searchResultsDiv = document.getElementById("searchResults");
const savedData = localStorage.getItem("pastSearches");
const weatherAPIKey = "22416836bfaaf9b43c5d9d1c14bbb7ff";
let pastSearches;

// Set up event listeners once the DOM is ready
$(function () {
  // Parse past searches from localStorage
  try {
    pastSearches = JSON.parse(savedData);
    displayPreviousSearch();
  } catch (error) {
    console.log("Invalid JSON: ", savedData);
    pastSearches = new Array(10);
  }

  // Attach submit event to the weather form
  weatherForm.addEventListener("submit", updateWeather);
});

// Handle form submission and update weather data
function updateWeather(event) {
  // Prevent the form from refreshing the page
  event.preventDefault();

  // Get the city entered by the user
  const city = document.getElementById("searchCity").value;
  if (pastSearches.length >= 10) {
    pastSearches.shift();
  }

  if (!pastSearches.includes(city)) {
    pastSearches.push(city);
  }

  localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  displayPreviousSearch();
  fetchWeatherData(city);
}

// Fetch weather data using OpenWeatherMap API
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

// Display past searches as clickable buttons
function displayPreviousSearch() {
  searchResultsDiv.innerHTML = ""; // Clear previous results

  if (pastSearches.length > 0) {
    pastSearches.forEach((item) => {
      if (item != null) {
        const itemDiv = document.createElement("button");
        itemDiv.textContent = item;
        itemDiv.addEventListener("click", onPreviousCityClick);
        searchResultsDiv.appendChild(itemDiv);
      }
    });
  } else {
    searchResultsDiv.textContent = "No results found";
  }
}

// Fetch weather data for a previously searched city
function onPreviousCityClick(event) {
  fetchWeatherData(event.target.textContent);
}

// Display current weather and forecast data
function displayResults(data) {
  let currentWeather = data.list[0];

  updateCurrentWeatherDisplay(data.city.name, currentWeather);
  updateForecast(data);
}

// Update the forecast section with weather data
function updateForecast(data) {
  weatherAtNoon = getWeatherAtNoon(data);

  $("#forecastData > div").remove();

  for (var i = 1; i < weatherAtNoon.length; i++) {
    let thisWeather = weatherAtNoon[i];
    let weatherDiv = createWeatherDiv(thisWeather);
    $("#forecastData").append(weatherDiv);
  }
}

// Display current weather details
function updateCurrentWeatherDisplay(cityName, currentWeather) {
  $("#currentWeather > *").remove();
  let cityNameDiv = document.createElement("h2");
  cityNameDiv.textContent = cityName;
  $("#currentWeather").append(cityNameDiv, createWeatherDiv(currentWeather));
}

// Create a div element for displaying weather details
function createWeatherDiv(weatherItem) {
  let div = document.createElement("div");

  let date = document.createElement("p");
  let icon = document.createElement("img");
  let temp = document.createElement("p");
  let wind = document.createElement("p");
  let humidity = document.createElement("p");

  date.textContent = formatDate(weatherItem.dt);

  icon.src = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;
  temp.textContent = "Temp: " + weatherItem.main.temp + "°C";
  wind.textContent = "Wind: " + weatherItem.wind.speed + " m/s";
  humidity.textContent = "Humidity: " + weatherItem.main.humidity + "%";

  div.append(date, icon, temp, wind, humidity);

  return div;
}

// Fetch and return the weather icon URL
function getIcon(iconCode) {
  let locationUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  fetch(locationUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const iconImgUrl = URL.createObjectURL(blob);
      return iconImgUrl;
    })
    .catch((error) => {
      console.error("Error fetching icon:", error);
    });
}

// Extract weather data for today and subsequent days at noon
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

// Convert Unix timestamp to mm/dd/yyyy format
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
