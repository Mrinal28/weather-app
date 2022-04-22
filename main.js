import './style.css'

const wrapper = document.querySelector(".wrapper"),
  inputsection = document.querySelector(".input-part"),
  infoTxt = inputsection.querySelector(".info-txt"),
  inputField = inputsection.querySelector("input"),
  locationButton = inputsection.querySelector("button"),
  weatherSection = wrapper.querySelector(".weather-part"),
  wIcon = weatherSection.querySelector("img");
let api;

inputField.addEventListener("keyup", event => { //call api on  enter key
  if (event.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationButton.addEventListener("click", () => { //get client location from navigator
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your device does not support geolocation");
  }
});

function requestApi(city) { //call weather api for city
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=23b7cb57afb1028bf811f9d5bde59da7`;
  fetchData();
}

function onSuccess(position) { //call weather api for latitude and longitude
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=23b7cb57afb1028bf811f9d5bde59da7`;
  fetchData();
}

function onError(error) { //error msg
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function fetchData() { //use fetch api to get weather data
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
    infoTxt.innerText = "Something went wrong";
    infoTxt.classList.replace("pending", "error");
  });
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} is not a valid city`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    if (id == 800) {
      wIcon.src = "https://img.icons8.com/cotton/128/000000/sun--v2.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "https://img.icons8.com/cotton/64/000000/storm--v2.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "https://img.icons8.com/cotton/64/000000/snow--v2.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "https://img.icons8.com/cotton/64/000000/windy-weather.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "https://img.icons8.com/cotton/64/000000/partly-cloudy-day--v1.png";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "https://img.icons8.com/cotton/64/000000/rain--v1.png";
    }

    weatherSection.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherSection.querySelector(".weather").innerText = description;
    weatherSection.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherSection.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherSection.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}