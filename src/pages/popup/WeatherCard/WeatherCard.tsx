import {
  Coord,
  fetchWeatherDataByCity,
  fetchWeatherDataByCord,
  WeatherDataAPIResponseWithTimeStamp,
} from '@src/utils/api';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton/IconButton';
import CardHeader from '@mui/material/CardHeader/CardHeader';
import { celToFar } from '@src/utils/math';
import {
  getWeatherDataFromLocalStorage,
  persistWeatherDataToLocalStorage,
} from '@src/utils/storage';
import { Avatar, Box, Divider } from '@mui/material';
import styles from './WeatherCard.module.scss';

export type WeatherCardProps = {
  city: string;
  scale: 'c' | 'f';
  onDelete: () => void;
  cord?: Coord;
};

const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  const { city, onDelete, scale, cord } = props;
  const [weatherData, setWeatherData] =
    useState<WeatherDataAPIResponseWithTimeStamp>();
  const [error, setError] = useState<string | null>();

  const getWeatherData = async (refresh: boolean): Promise<void> => {
    let data: WeatherDataAPIResponseWithTimeStamp | undefined | null = null;
    // try fetching from local storage
    if (!refresh) {
      data = await getWeatherDataFromLocalStorage(city);
    }

    // if nothing then fetch from API
    if (!data) {
      const apiData = cord
        ? await fetchWeatherDataByCord(cord)
        : await fetchWeatherDataByCity(city);

      // no data from API either
      if (!apiData) {
        setError(`Something went wrong fetching weather data for "${city}"`);
        return;
      }

      const now = new Date();
      data = { ...apiData, lastUpdate: now.toString() };

      // persist to local storage if it is not current location
      if (!cord) await persistWeatherDataToLocalStorage(city, data);
    }

    setWeatherData(data);
  };

  useEffect(() => {
    getWeatherData(false).then();
  }, [city, cord]);

  if (error) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardHeader
          action={
            <IconButton
              onClick={onDelete}
              color="error"
              sx={{ p: '10px' }}
              aria-label="delete weather card"
            >
              <DeleteIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Typography variant="body1" color={'red'}>
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h2" color={'blue'}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const mainTemp: number = Math.round(
    scale === 'f' ? celToFar(weatherData.main.temp) : weatherData.main.temp
  );
  const mainFeel: number = Math.round(
    scale === 'f'
      ? celToFar(weatherData.main.feels_like)
      : weatherData.main.feels_like
  );
  const mainMax: number = Math.round(
    scale === 'f'
      ? celToFar(weatherData.main.temp_max)
      : weatherData.main.temp_max
  );
  const mainMin: number = Math.round(
    scale === 'f'
      ? celToFar(weatherData.main.temp_min)
      : weatherData.main.temp_min
  );
  const scaleSymbol: string = scale === 'c' ? '\u2103' : '\u2109';
  const weatherIconUrl = `/animated-icons/fill/openweathermap/${weatherData.weather[0].icon}.svg`;

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <CardHeader
          avatar={
            <div className={styles['tooltip']}>
              <Avatar src={weatherIconUrl} aria-label="weather icon">
                R
              </Avatar>
              <span className={styles['tooltiptext']}>
                {weatherData.weather[0].description}
              </span>
            </div>
          }
          action={
            <Box>
              <IconButton
                onClick={() => getWeatherData(true).then()}
                color="primary"
                sx={{ p: '3px' }}
                aria-label="refresh weather info"
              >
                <RefreshIcon />
              </IconButton>
              <IconButton
                onClick={onDelete}
                color="error"
                sx={{ p: '3px' }}
                aria-label="delete weather card"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          }
          title={
            <Typography
              variant="h3"
              style={{ textTransform: 'capitalize', fontSize: '2rem' }}
            >
              {city}
            </Typography>
          }
          subheader={`Last updated on: ${new Date(
            weatherData.lastUpdate
          ).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}`}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: 'fit-content',
            gap: '0.5rem',
          }}
        >
          <Typography variant="body2">
            Temp: {mainTemp + scaleSymbol}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2">
            Feels like: {mainFeel + scaleSymbol}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2">
            Min temp: {mainMin + scaleSymbol}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2">
            Max temp: {mainMax + scaleSymbol}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
export default WeatherCard;
