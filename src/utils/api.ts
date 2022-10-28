const OPEN_WEATHER_API_KEY = '7dc20929cc12465dca70b9ce1d0c3fbb';
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export type WeatherDataAPIResponse = {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type Coord = {
  lon: number;
  lat: number;
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type Main = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

export type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

export type Rain = {
  '1h': number;
};

export type Clouds = {
  all: number;
};

export type Sys = {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
};

export const fetchWeatherData = async (
  city: string
): Promise<WeatherDataAPIResponse | null> => {
  const res = await fetch(
    `${OPEN_WEATHER_BASE_URL}?q=${city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
  );

  if (!res.ok) {
    return null;
  }

  const data: WeatherDataAPIResponse = await res.json();

  return data;
};
