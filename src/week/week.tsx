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
    const [interval, setInterval] = useState<number[]>([]);
    useEffect(()=> {
        const url=`https://aerisweather1.p.rapidapi.com/forecasts/${latitude},%20${longitude}`;

        fetch (url, options)
            .then(res => res.json())
            .then(result => setWeekWeather(result.response[0].periods))
            .catch(err => console.error(err))
    }, [longitude])
    useEffect(() => {
        if (weekWeather) {
            weekWeather.forEach((item: Weather, index:number)=> {
                if (index===0) setInterval([item.minTempC, item.maxTempC])
                if (item.minTempC<interval[0]) setInterval([item.minTempC, interval[1]])
                if (item.maxTempC>interval[1]) setInterval([interval[0], item.maxTempC])
            })
            console.log(interval)
        }
    }, [weekWeather])

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
            <div className='week-wrapper'>
                {weekWeather.map((elem, index) => {
                    return (
                        <div className='one-of-week'>
                            <>
                                <div className='week-date'>{getDate(index)}</div>
                                {getImage(elem.icon)}
                                <div className='temperature' style={{height: `${((interval[1]-interval[0])*3)}px`}}>
                                    <div className='top-line' style={{margin: `${(interval[1]-elem.maxTempC)*3}px 0 0 0`}}>
                                        {transformTemp(elem.maxTempC)}
                                    </div>
                                    <div className='middle' style={{height: `${(elem.maxTempC-elem.minTempC)*3}px`}}/>
                                    <div className='bottom-line' style={{margin: `0 0 ${(elem.minTempC-interval[0])*3}px 0`}}>
                                        {transformTemp(elem.minTempC)}
                                    </div>
                                </div>
                            </>    
                        </div>        
                    )
                })}
            </div>    
            <div className='wind-title'> Скорость ветра, м/с</div>
            <ul className='week-wind'>
                
                
                    {weekWeather.map((element, index)=> {
                        return <li className='wind' key={index}>{getWind(element)}</li>
                    })}
                
            </ul>
        </div>
    )
    return <div className='week-weather'></div>
}