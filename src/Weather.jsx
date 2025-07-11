import { Badge, Button, Card, Col, Container, Form, InputGroup, ListGroup, Nav, Row, Stack, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import './Weather.css'
import { useEffect, useRef, useState } from "react";
import clear_icon from "./assets/clear.png"
import cloud_icon from "./assets/cloud.png";
import drizzle_icon from "./assets/drizzle.png";
import rain_icon from "./assets/rain.png";
import snow_icon from "./assets/snow.png";
import humidity_icon from "./assets/humidity.png";
import wind_icon from "./assets/wind.png";
import search_icon from "./assets/search.png";
import nofav from "../src/assets/free-favourite-icon-2765-thumb.png"
import fav from "../src/assets/favorite.svg"
export default function Weather(params) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const [location, setLocation] = useState(null);
    const [weather_data, setWeather] = useState(false);
    const [weather_data_Two, setWeatherDayTwo] = useState(false);
    const allICons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
        
    }
    function convert(num,timezone) {
        let unix_timestamp = num ;

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds
        var date = new Date((unix_timestamp ) * 1000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedTime = date.toLocaleDateString('en-US', options) ;
        

        return formattedTime;
        
    }
    function error() {
        console.log("Unable to retrieve your location");
      }
    function handleLocationClick() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          console.log("Geolocation not supported");
        }
      }
      
        function fiveDayForecast(latitude,longitude){
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(dataFiveDay => {
                let iconOne =  dataFiveDay.list[0].weather[0].icon;
                let iconTwo =  dataFiveDay.list[8].weather[0].icon;
                let iconThree =  dataFiveDay.list[16].weather[0].icon;
                let iconFof =  dataFiveDay.list[24].weather[0].icon;
                let iconFive =  dataFiveDay.list[32].weather[0].icon;
            setWeatherDayTwo({
                dayShowOne:  getWeekday(dataFiveDay.list[0].dt_txt,dataFiveDay.city.timezone),
                dayShowTwo:  getWeekday(dataFiveDay.list[8].dt_txt,dataFiveDay.city.timezone),
                dayShowThree: getWeekday(dataFiveDay.list[16].dt_txt,dataFiveDay.city.timezone),
                dayShowFof: getWeekday(dataFiveDay.list[24].dt_txt,dataFiveDay.city.timezone),
                dayShowFive: getWeekday(dataFiveDay.list[32].dt_txt,dataFiveDay.city.timezone),              
                dayTempOne: dataFiveDay.list[0].main.temp,
                dayTempTwo: dataFiveDay.list[8].main.temp,
                dayTempThree: dataFiveDay.list[16].main.temp,
                dayTempFof: dataFiveDay.list[24].main.temp,
                dayTempFive: dataFiveDay.list[32].main.temp,                
                dayTempMaxOne:dataFiveDay.list[0].main.temp_max,
                dayTempMaxTwo: dataFiveDay.list[8].main.temp_max,
                dayTempMaxThree: dataFiveDay.list[16].main.temp_max,
                dayTempMaxFof: dataFiveDay.list[24].main.temp_max,
                dayTempMaxFive: dataFiveDay.list[32].main.temp_max,
                dayTempMinOne: dataFiveDay.list[0].main.temp_min,
                dayTempMinTwo: dataFiveDay.list[8].main.temp_min,
                dayTempMinThree:dataFiveDay.list[16].main.temp_min,
                dayTempMinFof: dataFiveDay.list[24].main.temp_min,
                dayTempMinFive: dataFiveDay.list[32].main.temp_min,
                iconsOne: allICons[ iconOne],
                iconsTwo: allICons[ iconTwo],
                iconsThree: allICons[ iconThree],
                iconsFof: allICons[iconFof],
                iconsFive: allICons[ iconFive],       
                // dayShowOne: "Ted"      
            }
            )
            })
            .catch(error => console.log(error));
        }
        // function formatSunrise(sunriseUnix, timezoneOffsetInSeconds) {
        //     const localSunrise = new Date((sunriseUnix + timezoneOffsetInSeconds) * 1000);
        //     return localSunrise.toLocaleTimeString('en-US', {
        //       hour: '2-digit',
        //       minute: '2-digit',
        //     });
        // }
        function formatSunrise(sunriseUnix, timezoneOffsetInSeconds) {
              // Create UTC timestamp
                const utcDate = new Date(sunriseUnix * 1000);

                // Get UTC hours and minutes
                const utcHours = utcDate.getUTCHours();
                const utcMinutes = utcDate.getUTCMinutes();

                // Add timezone offset in minutes
                const totalMinutes = utcHours * 60 + utcMinutes + timezoneOffsetInSeconds / 60;

                // Normalize to 0-24h
                const localHours = Math.floor((totalMinutes + 1440) % 1440 / 60);
                const localMinutes = Math.floor((totalMinutes + 1440) % 60);

                // Format with leading zeros
                const formattedHours = String(localHours).padStart(2, '0');
                const formattedMinutes = String(localMinutes).padStart(2, '0');

                return `${formattedHours}:${formattedMinutes}`;
          }
        function getWeekday(datetimeStr, timezoneOffsetInSeconds) {
            const date = new Date(datetimeStr);
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });

        // Make API call to OpenWeatherMap
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
          .then(response => response.json())
          .then(data => {
            const icon = data.weather[0].icon;
            fiveDayForecast(latitude,longitude);
            setWeather({
                humidity: data.main.humidity,
                wind: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                temp:  data.weather[0].main,
                sunrise:formatSunrise(data.sys.sunrise,data.timezone),
                sunset: formatSunrise(data.sys.sunset,data.timezone),
                todayDate: convert(data.dt,data.timezone),
                feels_like: Math.floor(data.main.feels_like), 
                icons: allICons[icon]
            })
          })
          .catch(error => console.log(error));
      }
      useEffect(
        ()=>{
            handleLocationClick()
            
        },[]
    )
    const inputSearchRef = useRef();
    const handleKeyDown = (event) => {
        // console.log(event.key)
        if (event.key === 'Enter') {
          // Perform search logic here using the searchTerm
        //   console.log('Searching for:');
        searchWeather(inputSearchRef.current.value)
        }
      };
    const searchWeather = async (city) => {
        console.log(city)
        if(city === ""){
            alert("Enter a name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            if(!response.ok){
                alert(data.message);
                return;
            }
            // console.log(response);
            // const icone = allICons[data.Weather[0].icon] || clear_icon
            // console.log(data.Weather[0].icon)
            // console.log(allICons[data.Weather[0].icon])
            const icon = data.weather[0].icon;
            console.log(data)
            // console.log()
            
            setWeather({
                humidity: data.main.humidity,
                wind: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                temp:  data.weather[0].main,
                sunrise:formatSunrise(data.sys.sunrise,data.timezone),
                sunset: formatSunrise(data.sys.sunset,data.timezone),
                todayDate: convert(data.dt,data.timezone),
                feels_like: Math.floor(data.main.feels_like), 
                icons: allICons[icon]
            })
        } catch (error) {
            setWeather(false);
            // console.error("Error data");
        }
        //geolocalisation name in long and lat
        try {
            const url = ` https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            if(!response.ok){
                alert(data.message);
                return;
            }
            fiveDayForecast(data[0].lat,data[0].lon)
            
        } catch (error) {
            setWeather(false);
            // console.error("Error data");
        }
        
    }

    // const saveFavorite = (weather_city) => {
    // const newFavorites = [...favorites, weather_city];
    // setFavorites(newFavorites);
    // localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // };

    // const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    // console.log(storedFavorites)
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favoriteCities");
        return saved ? JSON.parse(saved) : [];
      });
      const addFavorite = (city) => {
        if (favorites.includes(city)) return;

        if (favorites.length >= 3) {
          alert("You can only save up to 3 favorite cities.");
          return;
        }
    
        const updated = [...favorites, city];
        setFavorites(updated);
        localStorage.setItem("favoriteCities", JSON.stringify(updated));
      };
      const removeFavorite = (city) => {
        const updated = favorites.filter(c => c !== city);
        setFavorites(updated);
        localStorage.setItem("favoriteCities", JSON.stringify(updated));
      };
      console.log(favorites)
    return(
    <Container className="weather">
        <Row>
        <Col md={6}>
        <h2 className="mb-3">Weather App</h2>
          <InputGroup className="mb-4">
            <Form.Control onKeyDown={handleKeyDown} ref={inputSearchRef} placeholder="Enter city" />
            <Button onClick={()=>searchWeather(inputSearchRef.current.value)} variant="primary">Search</Button>
          </InputGroup>
          {weather_data?
            <div className="p-2">
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                <h4 >{weather_data.location}   <img title={favorites.includes(weather_data.location)?"remove to favorite":"add to favorite"}  style={{ cursor: "pointer" }} onClick={() => favorites.includes(weather_data.location)?removeFavorite(weather_data.location):addFavorite(weather_data.location)} width="35px"  className="rightstar" src={favorites.includes(weather_data.location)?fav:nofav} alt="sunny" /></h4>
                <p className="text-muted mb-1"> {weather_data.todayDate}</p>
                <div className="d-flex align-items-center">
                    <img width="75px" src={weather_data.icons} alt="sunny" />
                    <h3 class    Name="ms-3 mb-0">{weather_data.temperature}°F</h3>                   
                    <h6 className="ms-3 mb-0">Feels :{weather_data.feels_like}°F</h6>
                
                </div>
                <p className="fs-5 mt-2">{weather_data.temp}</p>
                <p>
                    <Badge bg="light" text="dark">💧 Humidity: {weather_data.humidity}%</Badge>{' '}
                    <Badge bg="light" text="dark">🌬 Wind: {weather_data.wind}km/h</Badge>
                </p>
                <p>
                    <Badge bg="light" text="dark"> Sunrise: {weather_data.sunrise}</Badge>{' '}
                    <Badge bg="light" text="dark"> Sunset: {weather_data.sunset}</Badge>
                </p>
                </Card.Body>
          </Card>
            </div>
        :<>
        <p>No Data</p>
    </>
    }
        </Col>
            
        <Col md={6}>
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                <h5>5-Day Forecast</h5>
                {
                weather_data_Two?
                <>
                    <div className="margTop">
                        <Row>
                            <Col><span><img width="25px" src={weather_data_Two.iconsOne} alt="sunny" /></span></Col>
                            <Col><span>{weather_data_Two.dayShowOne} </span></Col>
                            <Col><span> {weather_data_Two.dayTempOne}°F</span></Col>
                            <Col><small className="text-muted">{weather_data_Two.dayTempMinOne}°F  {weather_data_Two.dayTempMaxOne}°F</small></Col>
                        </Row>
                    </div> 
                    <div className="margTop">
                        <Row>
                            <Col><span><img width="25px" src={weather_data_Two.iconsTwo} alt="sunny" /></span></Col>
                            <Col><span>{weather_data_Two.dayShowTwo} </span></Col>
                            <Col><span> {weather_data_Two.dayTempTwo}°F</span></Col>
                            <Col><small className="text-muted">{weather_data_Two.dayTempMinTwo}°F  {weather_data_Two.dayTempMaxTwo}°F</small></Col>
                        </Row>
                    </div> 
                    <div className="margTop">
                        <Row>
                            <Col><span><img width="25px" src={weather_data_Two.iconsThree} alt="sunny" /></span></Col>
                            <Col><span>{weather_data_Two.dayShowThree} </span></Col>
                            <Col><span> {weather_data_Two.dayTempThree}°F</span></Col>
                            <Col><small className="text-muted">{weather_data_Two.dayTempMinThree}°F  {weather_data_Two.dayTempMaxThree}°F</small></Col>
                        </Row>
                    </div> 
                    <div className="margTop">
                        <Row>
                            <Col><span><img width="25px" src={weather_data_Two.iconsFof} alt="sunny" /></span></Col>
                            <Col><span>{weather_data_Two.dayShowFof} </span></Col>
                            <Col><span> {weather_data_Two.dayTempFof}°F</span></Col>
                            <Col><small className="text-muted">{weather_data_Two.dayTempMinFof}°F  {weather_data_Two.dayTempMaxFof}°F</small></Col>
                        </Row>
                    </div> 
                    <div className="margTop">
                        <Row>
                            <Col><span><img width="25px" src={weather_data_Two.iconsFive} alt="sunny" /></span></Col>
                            <Col><span>{weather_data_Two.dayShowFive} </span></Col>
                            <Col><span> {weather_data_Two.dayTempFive}°F</span></Col>
                            <Col><small className="text-muted">{weather_data_Two.dayTempMinFive}°F  {weather_data_Two.dayTempMaxFive}°F</small></Col>
                        </Row>
                    </div> 
                       
                   </> 
                :<></>}
                <div className="SavedCities">
                    <h4>Saved Cities</h4>
                    <Row>
                    {favorites.length > 0 ?
                    favorites.map((city, index) => (
                    <>
                        
                            <Col key={index}><Button size="sm" onClick={()=>searchWeather(city)} variant="outline-success">{city}</Button></Col>                                    
                           
                    </>
                    )):<p>No Favoris</p>}
                     </Row>           
                </div>
                </Card.Body>
            </Card>
            
        </Col>
      </Row>
    </Container>
    )
}