const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const submit = document.querySelector('#buttonSubmit');

const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');

const preventUIAccess = value => {
  messageOne.textContent = "";
  messageTwo.textContent = "";
  search.disabled = value;
  submit.disabled = value;
};

weatherForm.addEventListener('submit', e => {

  e.preventDefault();
  const location = search.value;

  preventUIAccess(true);
  messageOne.textContent = "Loading...";

  fetch(`/weather?address=${location}`)
    .then(response => {
      response.json().then(data => {
        preventUIAccess(false);
        if (data.error) {
          messageOne.textContent = data.error;
        } else {
          messageOne.textContent = `Location: ${data.location}`;
          messageTwo.textContent =
            `${data.forecast.summary} | ` +
            `${data.forecast.temperature}°C | ` +
            `Rain: ${data.forecast.rain_chance}% | ` +
            `High: ${data.forecast.temp_high}°C, Low: ${data.forecast.temp_low}°C`;
        }
      });
    }).catch(e => {
      preventUIAccess(false);
      console.log(e);
    });
});