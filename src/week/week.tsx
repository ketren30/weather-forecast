import './week.css';
import { Options, Weather } from '../types';
import { useEffect, useState } from 'react';

type Props = {
    longitude: number,
    latitude: number,
    options: Options
}

export const Week: React.FC<Props> = ({longitude, latitude, options})=> {
    const [weekWeather, setWeekWeather] = useState<[Weather]>();
    useEffect(()=> {
        const url=`https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}`;

        fetch (url, options)
            .then(res => res.json())
            .then(result => setWeekWeather(result.response[0].periods))
            .catch(err => console.error(err))
    }, [])

    const getDate = (num: number) => {
        const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        const months = [
            'янв', 
            'фев',
            'мар',
            'апр',
            'мая',
            'июня',
            'июля',
            'авг',
            'сент',
            'окт',
            'нояб',
            'дек',
        ]
        const date=new Date((new Date).getTime()+(num*24 * 60 * 60 * 1000));
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
    }
    const getImage = (str:string) => {
        return <img src={require(`../icons/${str}`)} />
    }
    const transformTemp = (temp:number) => {
        const toInt=Math.trunc(temp);
        if (toInt>0) return `+${toInt}`;
        return toInt
    }
    const getWind = (element: Weather) => {
        if (Math.trunc(element.windSpeedMinMPH/2.237)===Math.trunc(element.windSpeedMaxMPH/2.237)) return Math.trunc(element.windSpeedMinMPH/2.237)
        return `${Math.trunc(element.windSpeedMinMPH/2.237)}-${Math.trunc(element.windSpeedMaxMPH/2.237)}`
    }


    if (weekWeather) return (
        <div className='week-weather'>
            {weekWeather.map((elem, index) => {
                return (
                    <div className='one-of-week'>
                        <>
                            <div className='week-date'>{getDate(index)}</div>
                            {getImage(elem.icon)}
                            <div className='temperature' style={{top: `${105+elem.maxTempC-elem.minTempC}px`}}>
                                {transformTemp(elem.maxTempC)}
                                <div className='differ-size' style={{height: `${(elem.maxTempC-elem.minTempC)*2}px`}}></div>
                                {transformTemp(elem.minTempC)}
                            </div>
                            {index===0 && <div className='wind-title'>Скорость ветра, м/с</div>}
                            <div className='wind'>
                                {getWind(elem)}
                            </div>
                        </>
                    </div>
                )
            })}
        </div>
    )
    return <div></div>
}