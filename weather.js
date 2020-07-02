const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temp-value");
const descElement = document.querySelector(".temp-desc");
const locationElement = document.querySelector(".location");


const weather = {};

weather.temperature = {
	unit:"celsius"
}

const KELVIN = 273;

const key = "d386ea119a4b034f968ebd1b08032d62";

//check if browser support geolocation
if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
	notificationElement.style.display = "block";
	notificationElement.innerHTML = "<p>Browser doesn't Support geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	getWeather(latitude, longitude);
}

function showError(error){
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//GET WEATHER FROM APIs
function getWeather(latitude, longitude){
	let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
	fetch(api)
		.then(function(response){
			let data = response.json();
			return data;
		})
		.then(function(data){
			weather.temperature.value = Math.floor(data.main.temp - KELVIN);
			weather.description = data.weather[0].description;
			weather.iconId = data.weather[0].icon;
			weather.city = data.name;
			weather.country = data.sys.country;
		})
		.then(function(){
			displayWeather();
		});
}

function displayWeather(){
	iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value}o<span>C</span>`;
	descElement.innerHTML = weather.description;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function celsiusToFahrenheit(temperature){
	return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click",function(){
	if(weather.temperature.value === undefined) return;

	if(weather.temperature.unit == "celsius"){
		let Fahrenheit = celsiusToFahrenheit(weather.temperature.value);
		Fahrenheit = Math.floor(Fahrenheit);

		tempElement.innerHTML = `${Fahrenheit}o<span>F</span>`;
		weather.temperature.unit = "Fahrenheit";
	}else{
		tempElement.innerHTML = `${weather.temperature.value}o<span>C</span>`;
		weather.temperature.unit = "celsius";
	}
});
