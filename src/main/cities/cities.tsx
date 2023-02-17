import { useEffect, useState } from 'react';
import { cities } from './russia';
import { City, Coords } from '../../types';
import './cities.css';
import  glass from '../../images/glass.jpg'
import { useNavigate } from 'react-router-dom';

type Props = {
    isVisible: boolean,
    changeVis: () => void, 
    getAnotherCoords: (coords: Coords) => void,
    getCity: (city: string) => void,
    changeFiltr: (value: boolean) => void
}

export const Cities: React.FC<Props> = ({isVisible, changeVis, getAnotherCoords, getCity, changeFiltr}) => {
    const [searchString, setSearchString] = useState('');
    const [suitableCities, setSuitableCities] = useState<City[]|[]>([]);
    const [newCity, setNewCity] = useState('');
    const [isShowOptions, setIsShowOptions] = useState(true);
    const [radioValue, setRadioValue] = useState('2');
    const navigate = useNavigate();
    const findSuitable = (searching: string, list: City[]) => {
        if (!searching) return []
        return list.filter((item) => item.city.slice(0, searching.length).toLowerCase()===searching.toLowerCase())
    }

    useEffect (()=> {
        const Debounce = setTimeout(() => {
            const filteredCities = findSuitable(searchString, cities);
            setSuitableCities(filteredCities)
        }, 300)
        return ()=> clearTimeout(Debounce)
    }, [searchString]);

    const OnCityClick = (index: number) => {
        
        changeVis()
        setSearchString('')
        getCity(suitableCities[index].city)
        setNewCity(suitableCities[index].city)
        navigate('/')
        setIsShowOptions(false)
        changeFiltr(true)
    }
    const onSubmitClick = () => {
        console.log('куку')
        changeFiltr(false)
        changeVis()
        navigate('/')
    }

    useEffect(() => {
        if (newCity) {
            fetch(`https://nominatim.openstreetmap.org/search?q=${newCity}&format=json`)
                .then(response => response.json())
                .then(result => getAnotherCoords({lat: +result[0].lat, lon: +result[0].lon}))
                .catch(error => console.log("error", error));
        }
    }, [newCity])

    if (isVisible) return (
        <div className='cities-wrapper'>
            <div className='box'>
                <input type='radio' id='radio1' value='1' 
                    checked={radioValue==='1'? true: false}
                    onChange={(e)=>setRadioValue(e.target.value)}/>
                <label className='radio-label' htmlFor='radio1'>использовать службы геолокации</label>
                <div className='margin-left'>требуется ваше разрешение</div>

                <input type='radio' id='radio2' value='2' 
                    checked={radioValue==='2'? true: false}
                    onChange={(e)=>setRadioValue(e.target.value)}/>
                <label className='radio-label' htmlFor='radio2'> Выбрать: </label>   
                
                <div className='search'>
                    <img src={glass}/>
                    <input onChange={(e)=>setSearchString(e.currentTarget.value)} disabled={radioValue==='1'}
                        onFocus={(()=>setIsShowOptions(true))}/>
                </div>
                
                <div className='relative'>
                    {isShowOptions && searchString.length>1 && <ul className='options'>
                        {suitableCities.slice(0,8).map((elem, index) => <li 
                            onClick={()=>OnCityClick(index)} 
                            key={index}>{elem.city}, {elem.region}</li>)}
                    </ul>}
                </div>
                <div className='back-and-submit'>
                    <div className='close' onClick={changeVis}>&#8592; Вернуться назад</div>
                    <button className='submit' onClick={onSubmitClick}>Сохранить</button>
                </div>
                
                
            </div>
        </div>
    ) 
    else return null
}