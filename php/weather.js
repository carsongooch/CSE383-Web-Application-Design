/* CSE383 AJAX Lab 2
*Carson Gooch, cse383, Fall 2026, Week9 XMLHTTPRequest
*/

const LOCATION_API = "https://ceclnx01.cec.miamioh.edu/~campbest/cse383/api/location.php";
const QUAKE_API = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const OPENWEATHER = "c2a826fa57fc7d8ac3ed71d8b5f20921"

function showPage(name) {
  console.log("Name = " + name)
  //iterate over pages and make new page active
    for (const page of document.querySelectorAll("#main > section")) {
        let pageName = page.id;
        if (pageName == name) {
          page.style.display = "block";
        } else
      {
        page.style.display = "none";
      }
    }

    if (name === "earthquakes") loadEarthquakes();
}


// Register handlers after defer-loaded script is parsed.

function setWeatherMessage(message) {
	document.getElementById("weather-status").textContent = message;
}

function loadWeather(event) {
	event.preventDefault();
	let zipCode = document.getElementById("zipcode").value.trim();
	let weatherResults = document.getElementById("weather-results");
	weatherResults.hidden = true;

	document.getElementById("weather-place").textContent = "";
	document.getElementById("weather-zip").textContent = "";
	document.getElementById("weather-temp").textContent = "";	
	document.getElementById("weather-wind").textContent = "";
	document.getElementById("weather-direction").textContent = "";
	document.getElementById("weather-visibility").textContent = "";
	document.getElementById("weather-retrieved").textContent = "";

	if (!/^\d{5}$/.test(zipCode)) {
		setWeatherMessage("ZIP code must be five digits.");
		return;
	}
	
	let openWeatherUrl = "https://api.openweathermap.org/data/2.5/weather" + "?zip=" + zipCode + 
		",US" + "&appid=" + OPENWEATHER + "&units=imperial";
	
	const xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function() {
		console.log(xhr.responseText);
	if (xhr.status === 200) {
		try {
			let data = JSON.parse(xhr.responseText);
			console.log(data);

			let degrees = data.wind.deg;
			let direction = "";
			let compass = "";

			if (degrees < 22.5 || degrees >= 337.5) {
				compass = "N";
			} else if (degrees < 67.5) {
				compass = "NE";
			} else if (degrees < 112.5) {
				compass = "E";
			} else if (degrees < 157.5) {
                        	compass = "SE";
			} else if (degrees < 202.5) {
                        	compass = "S";
			} else if (degrees < 247.5) {
                        	compass = "SW";
			} else if (degrees < 292.5) {
				compass = "W";
			} else {
				compass = "NW";
			}

			direction = degrees + "° (" + compass + ")";

			document.getElementById("weather-place").textContent = data.name + ", " + data.sys.country;
			document.getElementById("weather-retrieved").textContent = "Retrieved: " + new Date().toLocaleString();
			document.getElementById("weather-zip").textContent = zipCode;
			document.getElementById("weather-temp").textContent = data.main.temp + " Degrees Fahrenheit";
			document.getElementById("weather-wind").textContent = data.wind.speed + " mph";
			document.getElementById("weather-direction").textContent = direction;
			document.getElementById("weather-visibility").textContent = data.visibility + " meters";

			weatherResults.hidden = false;
			setWeatherMessage("Weather Loaded Successfully");
		} catch (error) {
			console.log("Error, bad JSON", error);
			setWeatherMessage("Error reading weather data.");
		}
	} else {
		console.log("Request failed", xhr.status);
		setWeatherMessage("Error retrieving weather data");
	} 
     });
	xhr.open("GET", openWeatherUrl)
	xhr.send();
}

function loadEarthquakes() {

	let quakeList = document.getElementById("quake-list");
	let quakeStatus = document.getElementById("quake-status");

	for (let i = 1; i <= 5; i++) {
		document.getElementById("quake" + i).hidden= true;
	}
	quakeStatus.textContent = "Loading...";

	let xhr = new XMLHttpRequest();
	
	xhr.addEventListener("load", function() {
		if (xhr.status === 200) {
			try {
				let data = JSON.parse(xhr.responseText);
				console.log(data);
				for (let i = 0; i < data.features.length && i < 5; i++) {
					let index = i + 1;
					let earthQuake = data.features[i].properties;
					document.getElementById("quake" + index).hidden = false;
					document.getElementById("quake-title" + index).textContent = earthQuake.title;
					document.getElementById("quake-location" + index).textContent = "Location " + earthQuake.place;
					document.getElementById("quake-magnitude" + index).textContent = "Magnitude: " + earthQuake.mag;
					document.getElementById("quake-time" + index).textContent = "Time: " + new Date(earthQuake.time).toLocaleString();
					document.getElementById("quake-link" + index).href = earthQuake.url;
					document.getElementById("quake-link" + index).textContent = "View Details";
				}
			quakeStatus.textContent = "Earthquakes loaded successfully";		
			} catch (error) {
				console.log("Error reading data", error);
				quakeStatus.textContent = "Error reading data.";
			}
		} else {
			console.log("Request failed", xhr.status);
			quakeStatus.textContent = "Error reading data.";
		}
	});

	xhr.open("GET", QUAKE_API, true);
	xhr.send();
}

function submitLocation(event) {
	event.preventDefault();

	let locationName = document.getElementById("location-name").value.trim();
	let computer = document.getElementById("computer").value.trim();
	let locationStatus = document.getElementById("location-status");
	let locationResult = document.getElementById("location-results");
	locationResult.hidden=true;
	
	for (let i = 1; i <= 5; i++) {
		document.getElementById("location-row" + i).hidden = true;
	}

	if (locationName === "" || computer === "") {
		locationStatus.textContent = "Enter a location and a computer.";
		return;
	}
	locationStatus.textContent = "Submitting...";

	let locationData = {
		uid: "goochcj",
		location: locationName,
		computer: computer
	};

	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", function() {
		if (xhr.status === 200) {
			try {
				let data = JSON.parse(xhr.responseText);
				console.log(data);
				if (data.status === "OK") {
					for (let i = 0; i < data.info.length && i < 5; i++) {
						let index = i + 1;
						let submission = data.info[i];

						document.getElementById("location-row" + index).hidden = false;
						document.getElementById("location-uid" + index).textContent = submission.uid;
						document.getElementById("location-value" + index).textContent = submission.location;
						document.getElementById("location-computer" + index).textContent = submission.computer;
						document.getElementById("location-ip" + index).textContent = submission.clientIp;
						document.getElementById("location-time" + index).textContent = submission.time; 
					}

					document.getElementById("location-summary").textContent = "Records: " + data.count;
					locationResult.hidden = false;
					locationStatus.textContent = "Location Submitted Successfully";
				
				} else { 
					locationStatus.textContent = data.errormsg;
				}

				} catch (error) {
					console.log("Error with location data", error);
					locationStatus.textContent = "Error reading data";
				}
		} else {
			console.log("Request failed", xhr.status);
			locationStatus.textContent = "Error submitting data.";
		}
	});

	xhr.open("POST", LOCATION_API, true);
	  xhr.setRequestHeader(
    	"Content-Type",
    	"application/json"
 	 );
	xhr.send(JSON.stringify(locationData));
}

// iterate over all data-page buttons and add listener to button
document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
});
document.getElementById("weather-form").addEventListener("submit", loadWeather);
document.getElementById("refresh-quakes").addEventListener("click", loadEarthquakes);
document.getElementById("location-form").addEventListener("submit", submitLocation);

