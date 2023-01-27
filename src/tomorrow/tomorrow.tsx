import { useEffect, useState } from 'react';
import './tomorrow.css';
import { Weather, Options } from '../types';

type Props = {
    longitude: number,
    latitude: number,
    options: Options
}

export const Tomorrow: React.FC<Props> = ({longitude, latitude, options})=> {
    const [dayWeather, setDayWeather] = useState<[Weather]|undefined>();
    const [hourWeather, setHourWeather] = useState<[Weather]|undefined>();
    const [icon, setIcon]= useState('');
    const [translatedDescription, setTranslatedDescription] = useState<string>('');
    const windDirections = {
        'N': 'С', 'S': 'Ю', 'W': 'З', 'E': 'В',
        'NE': 'СВ', 'SE': 'ЮВ', 'SW': 'ЮЗ', 'NW': 'СЗ'
    }
    const tomorrowDate = () => {
        const today = new Date();
        const tomorrow = (new Date(today.getTime() + (24 * 60 * 60 * 1000))).toLocaleString();
        const tomArray = tomorrow.split('.');
        return `${tomArray[2].slice(0,4)}-${tomArray[1]}-${tomArray[0]}`
    }
    useEffect(()=> {
        const dayURL = `https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}?from=${tomorrowDate()}&plimit=1&filter=mdnt2mdnt`;
        const hourURL = `https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}?from=${tomorrowDate()}&plimit=8&filter=3hr`;

        fetch(dayURL, options)
            .then(res => res.json())
            .then(result => setDayWeather(result.response[0].periods))
            .catch(err => console.error('error:' + err));

        fetch(hourURL, options)
            .then(res => res.json())
            .then(result => setHourWeather(result.response[0].periods))
            .catch(err => console.error('error:' + err));
    }, [])

    useEffect(()=>{
        if (dayWeather) {
            if (dayWeather[0].weather=='Clear') setTranslatedDescription('Ясно')
            else {
                const encodedParams = new URLSearchParams();
                encodedParams.append("source_language", "en");
                encodedParams.append("target_language", "ru");
                encodedParams.append("text", dayWeather![0].weather);

                const url = 'https://text-translator2.p.rapidapi.com/translate';
                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'X-RapidAPI-Key': 'f19b7492a7msh06c64918e46264ap1a3b9cjsn5830d983f843',
                        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
                    },
                    body: encodedParams
                };
                fetch(url, options)
                    .then(res => res.json())
                    .then(json => setTranslatedDescription(json.data.translatedText))
                    .catch(err => console.error('error:' + err));
            }
            setIcon(dayWeather[0].icon.split('.').join('@2x.'));
        }      
    }, [dayWeather]);

        function getTime (timeStamp:number) {
            const dateObj=new Date(timeStamp*1000)
            let hours:number|string = dateObj.getHours();
            if (hours<10) hours=`0${hours}`;
            let minutes: number|string = dateObj.getMinutes();
            if (minutes<10) minutes=`0${minutes}`
            return `${hours}:${minutes}`
        }
    
        const transformTemp = (temp:number) => {
            const toInt=Math.trunc(temp);
            if (toInt>0) return `+${toInt}`;
            return toInt
        }
        const getImage = (str:string) => {
            return <img src={require(`../icons/${str}`)}/>
        }
        const getDate = () => {
            const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            const today = new Date();
            const date = new Date(today.getTime() + (24 * 60 * 60 * 1000))
            return `${days[date.getDay()]}, ${date.toLocaleString().slice(0, date.toLocaleString().length-3)}`
        }

    if (dayWeather && hourWeather) return (
        <div className='block'>
            <div className='date'>{getDate()}</div>
            <div className='main-and-details'>
                <div className='main-info'>
                    
                    {icon && <img src={require(`../icons/${icon}`)} className='pic'/>}
                    <div className='temp-and-shortWeather'>
                        <div className='temp'>{transformTemp(dayWeather![0].avgTempC)}</div>
                        <div className='shortWeather'>{translatedDescription||dayWeather![0].weather}</div>
                    </div>
                </div>

                <div className='details-wrapper'>
                    <div className='details'>
                        <div className='property'>Температура</div>
                        <div className='value'>
                            {transformTemp(dayWeather![0].minTempC)}...
                            {transformTemp(dayWeather![0].maxTempC)}
                            </div>
                    </div>
                    <div className='details'>
                        <div className='property'>Ветер</div>
                        <div className='value'>
                            {Math.trunc(dayWeather![0].windSpeedMinMPH/2.237)}&nbsp;&ndash;&nbsp;
                             {Math.trunc(dayWeather![0].windSpeedMaxMPH/2.237)} м/с, &nbsp;
                            {windDirections[dayWeather![0].windDir]}
                            </div>
                    </div>
                    <div className='details'>
                        <div className='property'>Влажность</div>
                        <div className='value'>{dayWeather![0].humidity}%</div>
                    </div>
                    <div className='details'>
                        <div className='property'>Давление</div>
                        <div className='value'>{Math.trunc(dayWeather![0].pressureMB/1.333)} мм.рт.ст.</div>
                    </div>                
                    <div className='details'>
                        <div className='property'>Видимость</div>
                        <div className='value'>{Math.ceil(dayWeather![0].visibilityKM)} км</div>
                    </div>
                </div>
            </div>

            <div className='hour-forecast-wrapper'>
                {hourWeather.map((item, index) => <div className='hour-forecast' key={index}>
                            {getTime(item.timestamp)}
                            <div className='temp'>{transformTemp(item.tempC)}</div>
                            {getImage(item.icon)}
                            <div className='property'>Ветер {Math.trunc(item.windSpeedMPH/2.237)} м/с</div>
                        </div>
                    )
                }

            </div>
            
        </div>
    )
    return <div></div>
}