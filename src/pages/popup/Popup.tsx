import '@pages/popup/Popup.css';
import WeatherCard from './WeatherCard/WeatherCard';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton/IconButton';
import { Divider, InputBase, Paper } from '@mui/material';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  getCitiesFromLocalStorage,
  getScaleFromLocalStorage,
  persistCitiesToLocalStorage,
  persistScaleToLocalStorage,
} from '@src/utils/storage';
import Grid from '@mui/material/Unstable_Grid2';

const Popup = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [scale, setScale] = useState<'c' | 'f'>('c');

  const inputRef = useRef<HTMLInputElement>();

  const addCity = () => {
    if (!inputRef.current) {
      return;
    }

    const userCity = inputRef.current.value;
    if (!userCity) {
      return;
    }

    inputRef.current.value = '';
    setCities((oldCities) => {
      // check for duplicated cities
      if (oldCities.some((c) => c === userCity)) {
        return oldCities;
      }

      const newCities = [...oldCities, userCity];

      persistCitiesToLocalStorage(newCities);

      return newCities;
    });
  };

  const deleteCity = (i: number): void => {
    setCities((oldCities) => {
      oldCities.splice(i, 1);

      persistCitiesToLocalStorage([...oldCities]);

      return [...oldCities];
    });
  };

  useEffect(() => {
    getCitiesFromLocalStorage().then((cities) => setCities(cities));
    getScaleFromLocalStorage().then((sc) => setScale(sc));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid xs={12}>
        <Paper
          component="form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            addCity();
          }}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
          }}
        >
          <IconButton
            onClick={() =>
              setScale((oldScale) => {
                const newScale = oldScale === 'c' ? 'f' : 'c';
                persistScaleToLocalStorage(newScale);
                return newScale;
              })
            }
            color="primary"
            sx={{ p: '10px' }}
            aria-label="directions"
          >
            {scale === 'c' ? '\u2103' : '\u2109'}
          </IconButton>
          <InputBase
            inputRef={inputRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter city name"
            inputProps={{ 'aria-label': 'enter city name' }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            onClick={addCity}
            color="primary"
            sx={{ p: '10px' }}
            aria-label="add city"
          >
            <AddIcon />
          </IconButton>
        </Paper>
      </Grid>
      {cities.map((city, i) => (
        <Grid key={i} xs={12}>
          <WeatherCard
            scale={scale}
            city={city}
            onDelete={() => deleteCity(i)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Popup;
