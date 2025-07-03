let loactionInput = document.getElementById("cityInput");
let searchBtn = document.getElementById("searchBtn");
let apiKey = "7c21dd1d813df7659b0b48bf93407e47";

let to_date = function (date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const t_date = `${day} ${month} ${year}`;
  return t_date;
};

let today_update = function (output) {
  document.getElementById("locationText").textContent = output.name + " " + output.date;
  document.getElementById("tempID").textContent = output.temp;
  document.getElementById("windID").textContent = output.wind;
  document.getElementById("humID").textContent = output.hum;
  let tempIcon = output.icon;
  let tempIconUrl = `https://openweathermap.org/img/wn/${tempIcon}@2x.png`;
  document.getElementById("tempIcon").src = tempIconUrl;
};

searchBtn.addEventListener("click", () => {
  let city = loactionInput.value;

  let url_w = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  let url_f = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  let options = {
    method: "GET",
  };

  fetch(url_w, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((jsonData) => {
      let date = new Date(jsonData.dt * 1000);
      let t_date_today = to_date(date);
      let forcast_today = {
        name: jsonData.name,
        date: t_date_today,
        temp: jsonData.main.temp,
        wind: jsonData.wind.speed,
        hum: jsonData.main.humidity,
        icon: jsonData.weather[0].icon,
      };
      today_update(forcast_today);
    })
    .catch((error) => {
      console.error(error);
      alert("Something went wrong: " + error.message);
    });

  fetch(url_f, options)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      let list = jsonData.list;
      let cityName = jsonData.city.name;

      let forecast_per_day = [];
      let used_dates = new Set();

      list.forEach((item) => {
        let date = new Date(item.dt * 1000);
        let day_string = date.toDateString();

        if (!used_dates.has(day_string)) {
          used_dates.add(day_string);

          forecast_per_day.push({
            name: cityName,
            date: to_date(date),
            temp: item.main.temp,
            wind: item.wind.speed,
            hum: item.main.humidity,
            icon: item.weather[0].icon,
          });
        }
      });

      let next_4_days = forecast_per_day.slice(1, 5);
      next_4_days.forEach((day, index) => {
        document.getElementById(`card_${index + 1}_date`).textContent = day.date;
        document.getElementById(`card_${index + 1}_temp`).textContent = day.temp;
        document.getElementById(`card_${index + 1}_wind`).textContent = day.wind;
        document.getElementById(`card_${index + 1}_humID`).textContent = day.hum;
        document.getElementById(`card_${index + 1}_img`).src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
      });
    });
});
