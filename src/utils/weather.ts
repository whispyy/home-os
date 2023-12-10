import cloud from '../assets/weather/cloud.svg'
import sun from '../assets/weather/sun.svg'
import moon from '../assets/weather/moon.svg'
import cloudDrizzle from '../assets/weather/cloud-drizzle.svg'
import cloudLightning from '../assets/weather/cloud-lightning.svg'
import cloudRainLight from '../assets/weather/cloud-light-rain.svg'
import cloudRain from '../assets/weather/cloud-rain.svg'
import cloudSnow from '../assets/weather/cloud-snow.svg'
import fog from '../assets/weather/fog.svg'
import wind from '../assets/weather/wind.svg'

import dots from '../assets/dots.svg'

export interface Weather {
  x: number,
  y: number,
  lastUpdated: string,
  temperature: number,
  temperatureUnit: string,
  code: number,
  isDay: number,
  json: any,
}

export const mapVMOCode = (code: number, isDay: boolean) => {

  if (code === 0 || code === 1 || code === 2) {
    return isDay ? sun : moon
  }

  if (code === 3) {
    return cloud
  }

  if (code >= 4 && code < 13 || code >= 30 && code < 36 || code >= 40 && code < 50) {
    return fog
  }

  if (code >=14 && code < 17 || code === 20 || code >= 50 && code < 60) {
    return cloudDrizzle
  }

  if (code === 21 || code >= 60 && code < 70) {
    return cloudRainLight
  }
  
  if (code === 22 || code === 26 || code >= 36 && code < 40 || code >= 83 && code < 91) {
    return cloudSnow
  }

  if (code >= 70 && code < 85) {
    return cloudRain
  }

  if (code === 13 || code === 17 || code >= 95 && code < 100) {
    return cloudLightning
  }

  if (code === 18) {
    return wind
  }

  return dots
}
