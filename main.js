const inputField = document.querySelector("input");
const searchBtn = document.querySelector(".searchButton");
const locationBtn = document.querySelector(".myLoc");
const cityPar = document.querySelector(".city");
const message = document.querySelector(".message");
const temp = document.querySelector(".temp");
const iconContainer = document.querySelector(".weatherIcon");
const weatherType = document.querySelector(".weatherType");
const feelsLike = document.querySelector(".feelsLike");
const wind = document.querySelector(".wind");
const clouds = document.querySelector(".clouds");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const icon = document.createElement("img");
const tempMin = document.querySelector(".tempMin");
const tempMax = document.querySelector(".tempMax");

const key = "38fb14fdaca18375986d97ee1bc07343";

//Adding data to HTML elements
//General function
function convertUnix(unixTimestamp) {
  let date = new Date(unixTimestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

//clean all the info boxed in case of error
function errorInfo() {
  cityPar.innerHTML = "";
  weatherType.innerHTML = "";
  clouds.innerHTML = "";
  icon.src = "";
  temp.innerHTML = "";
  feelsLike.innerHTML = "";
  wind.innerHTML = "";
  sunrise.innerHTML = "";
  sunset.innerHTML = "";
}

//rendering the info
function displayInfo(data) {
  message.innerHTML = "";
  cityPar.innerHTML = data.name;
  temp.innerHTML = `${data.main.temp.toFixed(1)}°C`;
  icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  iconContainer.appendChild(icon);
  weatherType.innerHTML = data.weather[0].main;
  feelsLike.innerHTML = `Feels like: ${data.main.feels_like.toFixed(1)}°C`;
  // tempMin.innerHTML = `Min Temp: ${data.main.temp_min.toFixed(1)}°C`;
  // tempMax.innerHTML = `Max Temp: ${data.main.temp_max.toFixed(1)}°C`;
  wind.innerHTML = `Wind: <br> ${data.wind.speed}m/s`;
  clouds.innerHTML = `Clouds: <br>${data.clouds.all}%`;
  sunrise.innerHTML = `Sunrise:<br> ${convertUnix(data.sys.sunrise)}`;
  sunset.innerHTML = `Sunset:<br> ${convertUnix(data.sys.sunset)}`;

  //map function
  function initMap() {
    const location = { lat: data.coord.lat, lng: data.coord.lon };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: location,
    });
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }
  initMap();
}

//clearing events
function clearOnClick(btn) {
  btn.onclick = null;
}

//obtaining the local weather based on geolocation
// made it default function when loading the page as it is in most weather apps
function localWeather() {
  clearOnClick(searchBtn);
  inputField.value = "";
  function successCallback(geolocationPosition) {
    const lat = geolocationPosition.coords.latitude;
    const lon = geolocationPosition.coords.longitude;
    (async function () {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        displayInfo(data);
      }
    })();
  }

  function errorCallback(error) {
    console.log(error);
    errorInfo();
    message.innerHTML = `We couldn't get your geolocation.<br> Please check your settings or enter the city manually`;
  }

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

//event listeners
locationBtn.addEventListener("click", localWeather);
window.addEventListener("load", localWeather);
searchBtn.addEventListener("click", function (event) {
  clearOnClick(locationBtn);
  let city = inputField.value.trim().toLowerCase();
  try {
    if (city != "") {
      (async function () {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data); // just checking
          //displaying the info
          displayInfo(data);
        } else {
          errorInfo();
          message.innerHTML =
            "Oops we couldn't find the city. Please try searching another one";
        }
      })();
    } else {
      errorInfo();
      message.innerHTML = `Please enter a city name`;
    }
  } catch (error) {
    errorInfo();
    message.innerHTML = "Oops something went wrong";
  }
});
