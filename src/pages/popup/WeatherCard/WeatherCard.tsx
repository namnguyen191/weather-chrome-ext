import { fetchWeatherData, WeatherDataAPIResponse } from '@src/utils/api';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';
import CardHeader from '@mui/material/CardHeader/CardHeader';

export type WeatherCardProps = {
  city: string;
  onDelete: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  const { city, onDelete } = props;
  const [weatherData, setWeatherData] = useState<WeatherDataAPIResponse>();
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    fetchWeatherData(city).then((data) => {
      if (data) {
        setWeatherData(data);
      } else {
        setError(`Something went wrong fetching weather data for "${city}"`);
      }
    });
  }, [city]);

  if (error) {
    return (
      <Card sx={{ minWidth: 275 }}>
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
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h2" color={'blue'}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
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
          title={
            <Typography variant="h4" style={{ textTransform: 'capitalize' }}>
              {city}
            </Typography>
          }
        />
        <Typography variant="body2">
          Temp: {Math.round(weatherData.main.temp)}
          <br />
          Feels like: {Math.round(weatherData.main.feels_like)}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default WeatherCard;
