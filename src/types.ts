export interface Info {
    success: boolean,
    error: {},
    response: [WeekResponse]
  }
  export interface WeekResponse {
    periods: [Weather],
    place: Object
  }
  interface windDirections {
    'N': string, 
    'S': string, 
    'W': string, 
    'E': string,
    'NE': string,
     'SE': string, 
     'SW': string, 
     'NW': string
}
  export interface Weather {
    avgFeelslikeC: number,
    avgTempC: number,
    feelslikeC: number,
    humidity: number,
    icon: string,
    isDay: boolean,
    maxFeelslikeC: number,
    maxTempC: number,
    minFeelslikeC: number,
    minTempC: number,
    weather: string,
    windSpeedMPH: number,
    windSpeedMaxMPH: number,
    windSpeedMinMPH: number,
    windDir: keyof windDirections,
    tempC: number,
    pressureMB: number,
    timestamp: number, 
    visibilityKM: number 
  }
  
  export interface cityName {
    suggestions: [{data: {city:string}}]
  }

  export interface Options {
    method: string, 
    headers: {
      'X-RapidAPI-Key': string,
      'X-RapidAPI-Host': string,
      'Content-Type'?:string
    }
  }