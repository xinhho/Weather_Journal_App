const userInfo = document.getElementById('userInfo');
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
    e.preventDefault();

    //get user input
    const zipCode = document.getElementById('zip').value;
    const feel = document.getElementById('feelings').value;

    const d = new Date();
    const newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const apiKey = '2d38ed591bea4bd6371075900633fb91';

    if (zipCode !== '') {
        generateBtn.classList.remove('invalid');
        getWeatherData(apiUrl, zipCode, apiKey)
            .then((data) => {
              postUserInfoData('/add', { temp: data.main.temp, date: newDate, feel: feel });
            }).then(() => {
              updateDynamicUI()
            }).catch((error) => {
                alert('Please try again enter difference zip code!');
            });
        userInfo.reset();
    } else {
        generateBtn.classList.add('invalid');
    }
}

/* GET method*/
const getWeatherData = async(apiUrl, zipCode, apiKey) => {
    const res = await fetch(`${apiUrl}?q=${zipCode}&appid=${apiKey}&units=imperial`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {}
};

/* POST method */
const postUserInfoData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            feel: data.feel
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

const updateDynamicUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update new entry values
        if (allData.date !== undefined && allData.temp !== undefined && allData.feel !== undefined) {
          document.getElementById('date').innerHTML = allData.date;
          document.getElementById('temp').innerHTML = Math.round(allData.temp)+ ' degrees';
          document.getElementById('content').innerHTML = allData.feel;
        }
    } catch (error) {
        console.log('error', error);
    }
};
