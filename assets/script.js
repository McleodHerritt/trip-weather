// Select the form using its ID
const weatherForm = document.getElementById("weatherSearch");
const searchResultsDiv = document.getElementById("searchResults");
var pastSearches = new Array(10);
const weatherAPIKey = "22416836bfaaf9b43c5d9d1c14bbb7ff";

// Add an event listener to the form
weatherForm.addEventListener("submit", updateWeather);

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

  displayPreviousSearch();
  // Fetch weather data for the city (this is just a placeholder, you'll need to use an actual API)
  fetchWeatherData(city);
}

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
      const itemDiv = document.createElement("button");
      itemDiv.textContent = item; // Adjust based on the actual data structure
      itemDiv.addEventListener("click", onPreviousCityClick);
      searchResultsDiv.appendChild(itemDiv);
    });
  } else {
    searchResultsDiv.textContent = "No results found";
  }
}

function onPreviousCityClick(event) {
  fetchWeatherData(event.target.textContent);
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
    let thisWeather = weatherAtNoon[i];
    let weatherDiv = createWeatherDiv(thisWeather);
    $("#forecastData").append(weatherDiv);
  }
}

function updateCurrentWeatherDisplay(cityName, currentWeather) {
  $("#currentWeather > *").remove();
  let cityNameDiv = document.createElement("h2");
  cityNameDiv.textContent = cityName;
  $("#currentWeather").append(cityNameDiv, createWeatherDiv(currentWeather));
}

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
