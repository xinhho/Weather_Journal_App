const generateBtn = document.getElementById('generate');
const currentDateElement = document.getElementById('current-date');
const temperatureElement = document.getElementById('temperature');
const userResponseElement = document.getElementById('user-response');

currentDateElement.insertAdjacentHTML( 'beforeBegin', 'Current Date: ' )
temperatureElement.insertAdjacentHTML( 'beforeBegin', 'Outside temperature: ' )
userResponseElement.insertAdjacentHTML( 'beforeBegin', 'You are feeling about weather: ' )

generateBtn.addEventListener('click', submitAction);

function submitAction(event) {
  event.preventDefault();
  const zipCode = document.getElementById('zip').value;
  const userResponse = document.getElementById('feel').value;
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = '2d38ed591bea4bd6371075900633fb91';

  if (zipCode !== '' && userResponse !== '') {
    getWeatherInforData(apiUrl, zipCode, apiKey, userResponse);
  } else {
    showError('You are missing zip Code or feeling')
  }
}

const showError = (errorMessage = '') => {
  const errorElement = document.getElementById('error');
  errorElement.innerHTML = '';
  if (errorMessage !== '') {
    var text = document.createTextNode(errorMessage);
    errorElement.appendChild(text);
  }
}

/* GET method*/
const getWeatherInforData = async (apiUrl='', zipCode='', apiKey='', userResponse='') => {
  const response = await fetch(`${apiUrl}?q=${zipCode}&appid=${apiKey}&units=imperial`);
  try {
    const newData = await response.json();
    console.log(newData);
    if (newData?.message) {
      showError(`${newData.message}. Please try again enter difference zip code!!`)
    } else {
      showError('')
      const temperature = newData?.main?.temp
      postUserInfoData(userResponse, temperature);
    }
  } catch(error) {}
};

/* POST method */
const postUserInfoData = async (userResponse = '', temperature = '') => {

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${day}-${month}-${year}`;

  const parameter = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      temperature: temperature,
      date: currentDate,
      userResponse: userResponse
    })
  }

  const response = await fetch('/add', parameter);
  try {
    const weatherData = await response.json();
    updateDynamicUI();
    return weatherData;
  } catch (error) {
    console.log(error);
  }
};

const updateDynamicUI = async () => {
  const request = await fetch('/all');
  try {
    const weatherData = await request.json();
    if (weatherData.date !== undefined && weatherData.temperature !== undefined && weatherData.userResponse !== undefined) {
      document.getElementById('current-date').innerHTML = weatherData.date;
      document.getElementById('temperature').innerHTML = Math.round(weatherData.temperature)+ ' degrees';
      document.getElementById('user-response').innerHTML = weatherData.userResponse;
    }
  } catch (error) {
    console.log('error', error);
  }
};
