import '@pages/popup/Popup.css';
import WeatherCard from './WeatherCard/WeatherCard';

import { useEffect, useState } from 'react';
import {
  getCitiesFromLocalStorage,
  getScaleFromLocalStorage,
  persistCitiesToLocalStorage,
  persistScaleToLocalStorage,
} from '@src/utils/storage';
import Grid from '@mui/material/Unstable_Grid2';
import MainInput, { Scale } from './MainInput/MainInput';

const Popup = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [scale, setScale] = useState<Scale>('c');

  const onAddCity = (addedCity: string): void => {
    setCities((oldCities) => {
      // check for duplicated cities
      if (oldCities.some((c) => c === addedCity)) {
        return oldCities;
      }

      const newCities = [...oldCities, addedCity];

      persistCitiesToLocalStorage(newCities);

      return newCities;
    });
  };

  const onScaleChange = (newScale: Scale): void => {
    setScale(newScale);
    persistScaleToLocalStorage(newScale);
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
        <MainInput onAddCity={onAddCity} onScaleChange={onScaleChange} />
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
