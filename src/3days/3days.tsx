import './3days.css';
import { Options, Weather } from '../types';
import { useEffect, useState } from 'react';

type Props = {
    longitude: number,
    latitude: number,
    options: Options
}

export const ThreeDays: React.FC<Props> = ({longitude, latitude, options})=>{
    const [threeDaysWeather, setThreeDaysWeather] = useState<[Weather]>();
    const todayDate = () => {
        const today = (new Date()).toLocaleString();
        const arr = today.split('.');
        return `${arr[2].slice(0,4)}-${arr[1]}-${arr[0]}`
    }

    useEffect(()=> {
        const url = `https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}?from=${todayDate()}&plimit=12&filter=6hr`;

        fetch(url, options)
        .then(res => res.json())
        .then(result => setThreeDaysWeather(result.response[0].periods))
        .catch(err => console.error(err))
    }, [longitude]);

    const getDate = (num: number) => {
        const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        const months = [
            'января', 
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря',
        ]
        const date=new Date((new Date).getTime()+(num*24 * 60 * 60 * 1000));
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
    }
    const daysArray=[getDate(0), getDate(1), getDate(2)];
    const getImage = (str:string) => {
        return <img src={require(`../icons/${str}`)} className='image'/>
    }
    const getPartOfDay = (index:number) => {
        switch (index) {
            case 0: case 4: case 8:
                return 'Ночь';
            case 1: case 5: case 9:
                return 'Утро';
            case 2: case 6: case 10:
                return 'День';
            case 3: case 7: case 11:
                return 'Вечер';    
        }
    }
    const getWind = (element: Weather) => {
        if (Math.trunc(element.windSpeedMinMPH/2.237)===Math.trunc(element.windSpeedMaxMPH/2.237)) return Math.trunc(element.windSpeedMinMPH/2.237)
        return `${Math.trunc(element.windSpeedMinMPH/2.237)}-${Math.trunc(element.windSpeedMaxMPH/2.237)}`
    }
    const transformTemp = (temp:number) => {
        const toInt=Math.trunc(temp);
        if (toInt>0) return `+${toInt}`;
        return toInt
    }

    if (threeDaysWeather) return (
        <div className='three-days-wrapper'>
            {daysArray.map((item, i)=> {
                return (
                <div className='days' key={i}>
                <>
                    <div className='date'>{item}</div>
                    <div className='parts-of-day' >
                        {threeDaysWeather.map((elem, index)=>{
                            if (index>=4*i && index<=(4*i+3))
                            return (
                                <div key={index}>
                                    {getImage(elem.icon)}
                                    {getPartOfDay(index)}
                                    <div className='temp'>{transformTemp(elem.avgTempC)}</div>
                                    {i===0 && index===0 && <div className='wind-speed'>Скорость ветра, м/с</div>}
                                    <div className='wind'>
                                        {getWind(elem)}
                                    </div>
                                    {i===0 && index===0 && <div className='feels-like'>По ощущению</div>}
                                    <div className='feels-temp'>{transformTemp(elem.avgFeelslikeC)}</div>

                                </div>
                            )
                        })}
                    </div>
                </>    
                </div>
                )
            })}      
        </div>
    )
    return <div className='three-days-wrapper'></div>
}