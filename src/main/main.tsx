import { useState, useEffect, useMemo} from 'react';
import './main.css';
import { useGeolocated } from "react-geolocated";
import background from '../images/background.jpg';
import { Coords } from '../types';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate
} from "react-router-dom";
import { Today } from '../today/today';
import { Tomorrow } from '../tomorrow/tomorrow';
import { ThreeDays } from '../3days/3days';
import { Week } from '../week/week';
import { Cities } from './cities/cities';


export const Main = () => {
    const [isCities, setIsCities] = useState(false);
    const [coordinates, setCoordinates] = useState<Coords>();
    const [anotherCoords, setAnotherCoords] = useState<Coords>();
    const [isAnotherCity, setIsAnotherCity] = useState(false);
    const [anotherCityName, setAnotherCityName] = useState<string>();
    const [mainOptions] = useState({
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f19b7492a7msh06c64918e46264ap1a3b9cjsn5830d983f843',
        'X-RapidAPI-Host': 'aerisweather1.p.rapidapi.com'
      }
    });
    const [currentcity, setCurrentcity]= useState<string>('');
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
    function DefineCity() {
          const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";

          const options = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": "Token fe51fd31bf5ee674cc0cdf30c5915eb32a0ac580"
              },
              body: JSON.stringify({lat: coords?.latitude, lon: coords?.longitude})
          }
          fetch(url, options)
            .then(response => response.json())
            .then(result => setCurrentcity(result.suggestions[0].data.city))
            .catch(error => console.log("error", error));
        }
    const getAnotherCoords = (coordinates: Coords) => {
      setAnotherCoords(coordinates)
    }
    const getCityName = (city: string) => {
      setAnotherCityName(city)
    }

    useEffect(()=>{
      if (coords && !isAnotherCity) {
        DefineCity()
        setCoordinates({lat: coords.latitude, lon: coords.longitude})
      }
      if (isAnotherCity && anotherCoords) {
        setCoordinates(anotherCoords)
      }
    }, [coords, isAnotherCity, anotherCoords]);

    const getClassName = (navData: any) => {
      if (navData.isActive) return 'navigation-points-active'
      else return 'navigation-points'
    }
    const ChangeVisibility = () => {
      setIsCities(prev=>!prev)
    }
    const ChangeFiltr = (value: boolean) => {
      setIsAnotherCity(value)
    }

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coordinates ? (
        <div className='wrapper'>
          <img src={background} className='back-image'/>
          <div className='weather-information'>
            <div className='navigation'>
              <NavLink className={getClassName} id='nav' to="/" >Сегодня</NavLink>
              <NavLink className={getClassName} id='nav' to="/tomorrow" >Завтра</NavLink>
              <NavLink className={getClassName} id='nav' to="/3days" >Проноз на 3 дня</NavLink>
              <NavLink className={getClassName} id='nav' to="/week" >Прогноз на неделю</NavLink>
            </div>
            <Routes>
            <Route path='/' element={<Today longitude={coordinates.lon} latitude={coordinates.lat} options={mainOptions}/>} />
            <Route path='/tomorrow' element={<Tomorrow longitude={coordinates.lon} latitude={coordinates.lat} options={mainOptions}/>} />
            <Route path='/3days' element={<ThreeDays longitude={coordinates.lon} latitude={coordinates.lat} options={mainOptions}/>} />
            <Route path='/week' element={<Week longitude={coordinates.lon} latitude={coordinates.lat} options={mainOptions}/>} />
            </Routes>

            <div className='cities' >
                <div>{isAnotherCity?anotherCityName:currentcity}</div>
                <div onClick={ChangeVisibility} className='cursor'>Изменить пункт</div>
            </div>
          </div>
          <Cities isVisible={isCities} 
            changeVis={ChangeVisibility} 
            getAnotherCoords={getAnotherCoords} 
            getCity={getCityName}
            changeFiltr={ChangeFiltr}/>
          
                   
        </div>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};


