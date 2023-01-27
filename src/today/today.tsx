import { Weather, Options } from '../types';
import {useEffect, useState} from 'react';
import './today.css';


type Props = {
    longitude: number,
    latitude: number,
    options: Options
}

export const Today: React.FC<Props> = ({longitude, latitude, options})=>{  
    const [currentInfo, setCurrentInfo] = useState<[Weather]|undefined>();
    const [icon, setIcon]= useState('');
    const [translatedDescription, setTranslatedDescription] = useState<string>('');
    const windDirections = {
        'N': 'С', 'S': 'Ю', 'W': 'З', 'E': 'В',
        'NE': 'СВ', 'SE': 'ЮВ', 'SW': 'ЮЗ', 'NW': 'СЗ'
    }
    useEffect(() => {
        const url = `https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}?plimit=13&filter=1hr`;
        fetch(url, options)
        .then(response => response.json())
        .then(result => setCurrentInfo(result.response[0].periods))
        .catch(error => console.log("error", error));
    }, []);

    useEffect(()=>{
        if (currentInfo) {
            if (currentInfo[0].weather=='Clear') setTranslatedDescription('Ясно')
            else {
                const encodedParams = new URLSearchParams();
                encodedParams.append("source_language", "en");
                encodedParams.append("target_language", "ru");
                encodedParams.append("text", currentInfo![0].weather);

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
            setIcon(currentInfo[0].icon.split('.').join('@2x.'));
        }   

    }, [currentInfo]);
    

    const getTime = (timeStamp:number)=> {
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
        const date=new Date;
        return `${days[date.getDay()]}, ${date.toLocaleString().slice(0, date.toLocaleString().length-3)}`
    }

    if (currentInfo) return (
        <div className='block'>
            <div className='date'>{getDate()}</div>
            <div className='main-and-details'>
                <div className='main-info'>
                    
                    {icon && <img src={require(`../icons/${icon}`)} className='pic'/>}
                    <div className='temp-and-shortWeather'>
                        <div className='temp'>{transformTemp(currentInfo![0].tempC)}</div>
                        <div className='shortWeather'>{translatedDescription||currentInfo![0].weather}</div>
                    </div>
                </div>

                <div className='details-wrapper'>
                    <div className='details'>
                        <div className='property'>По ощущению</div>
                        <div className='value'>{transformTemp(currentInfo![0].feelslikeC)}</div>
                    </div>
                    <div className='details'>
                        <div className='property'>Ветер</div>
                        <div className='value'>{Math.trunc(currentInfo![0].windSpeedMPH/2.237)} м/с, {windDirections[currentInfo![0].windDir]}</div>
                    </div>
                    <div className='details'>
                        <div className='property'>Влажность</div>
                        <div className='value'>{currentInfo![0].humidity}%</div>
                    </div>
                    <div className='details'>
                        <div className='property'>Давление</div>
                        <div className='value'>{Math.trunc(currentInfo![0].pressureMB/1.333)} мм.рт.ст.</div>
                    </div>                
                    <div className='details'>
                        <div className='property'>Видимость</div>
                        <div className='value'>{Math.ceil(currentInfo![0].visibilityKM)} км</div>
                    </div>
                </div>
            </div>

            <div className='hour-forecast-wrapper'>
                {currentInfo.map((item, index) => {
                    if (index%2==1) return (
                        <div className='hour-forecast' key={index}>
                            {getTime(item.timestamp)}
                            <div className='temp'>{transformTemp(item.tempC)}</div>
                            {getImage(item.icon)}
                            <div className='property'>Ветер {Math.trunc(item.windSpeedMPH/2.237)} м/с</div>
                        </div>
                    )
                })}

            </div>
            
        </div>
    )
    return <div></div>
}