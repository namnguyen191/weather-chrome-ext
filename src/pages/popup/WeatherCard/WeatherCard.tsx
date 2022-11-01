import {
  fetchWeatherData,
  WeatherDataAPIResponseWithTimeStamp,
} from '@src/utils/api';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';
import CardHeader from '@mui/material/CardHeader/CardHeader';
import { celToFar } from '@src/utils/math';
import {
  getWeatherDataFromLocalStorage,
  persistWeatherDataToLocalStorage,
} from '@src/utils/storage';

export type WeatherCardProps = {
  city: string;
  scale: 'c' | 'f';
  onDelete: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  const { city, onDelete, scale } = props;
  const [weatherData, setWeatherData] =
    useState<WeatherDataAPIResponseWithTimeStamp>();
  const [error, setError] = useState<string | null>();

  const getWeatherData = async (): Promise<void> => {
    // try fetching from local storage first
    let data: WeatherDataAPIResponseWithTimeStamp | undefined | null =
      await getWeatherDataFromLocalStorage(city);

    // if nothing then fetch from API
    if (!data) {
      const apiData = await fetchWeatherData(city);

      // no data from API either
      if (!apiData) {
        setError(`Something went wrong fetching weather data for "${city}"`);
        return;
      }

      data = { ...apiData, lastUpdate: new Date() };

      // persist to local storage
      await persistWeatherDataToLocalStorage(city, data);
    }

    setWeatherData(data);
  };

  useEffect(() => {
    getWeatherData().then();
  }, [city]);

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

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <CardHeader
          action={
            <IconButton
              onClick={onDelete}
              color="error"
              sx={{ p: '3px' }}
              aria-label="delete weather card"
            >
              <DeleteIcon />
            </IconButton>
          }
          title={
            <Typography variant="h3" style={{ textTransform: 'capitalize' }}>
              {city}
            </Typography>
          }
          subheader={`Last updated on: ${weatherData.lastUpdate.toLocaleDateString(
            undefined,
            {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }
          )}`}
        />
        <Typography variant="body2">
          Temp:{' '}
          {Math.round(
            scale === 'f'
              ? celToFar(weatherData.main.temp)
              : weatherData.main.temp
          )}
          <br />
          Feels like:{' '}
          {Math.round(
            scale === 'f'
              ? celToFar(weatherData.main.feels_like)
              : weatherData.main.feels_like
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default WeatherCard;
