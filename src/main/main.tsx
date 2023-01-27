import { useState, useEffect, useMemo} from 'react';
import './main.css';
import { useGeolocated } from "react-geolocated";
import background from '../images/background.jpg';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate
} from "react-router-dom";
import { Today } from '../today/today';
import { Tomorrow } from '../tomorrow/tomorrow';
import { ThreeDays } from '../3days/3days'


export const Main = () => {
    const [mainOptions, setMainOpions] = useState({
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f19b7492a7msh06c64918e46264ap1a3b9cjsn5830d983f843',
        'X-RapidAPI-Host': 'aerisweather1.p.rapidapi.com'
      }
    });
    const [cityName, setCityName]= useState<string>('');
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
            .then(result => setCityName(result.suggestions[0].data.city))
            .catch(error => console.log("error", error));
        }

    useEffect(()=>{
      if (coords) DefineCity()
    }, [coords]);

    const today = useMemo(()=>{
      if (coords) return <Today longitude={coords.longitude} latitude={coords.latitude} options={mainOptions}/>
    }, [coords])

    const getClassName = (navData: any) => {
      if (navData.isActive) return 'navigation-points-active'
      else return 'navigation-points'
    }


    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
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
            <Route path='/' element={today} />
            <Route path='/tomorrow' element={<Tomorrow longitude={coords.longitude} latitude={coords.latitude} options={mainOptions}/>} />
            <Route path='/3days' element={<ThreeDays longitude={coords.longitude} latitude={coords.latitude} options={mainOptions}/>} />
            {/* <Route path='/week' element={<Teachers/>} /> */}
            </Routes>

            <div className='cities' >
                <div>Город {cityName}</div>
                <div>Изменить местоположение</div>
            </div>
          </div>

          
                   
        </div>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};


