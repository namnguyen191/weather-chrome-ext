import '@pages/popup/Popup.css';
import WeatherCard from './WeatherCard/WeatherCard';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton/IconButton';
import { InputBase, Paper } from '@mui/material';
import { FormEvent, useRef, useState } from 'react';

const Popup = () => {
  const [cities, setCities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>();

  const addCity = () => {
    if (!inputRef.current) {
      return;
    }

    const userCity = inputRef.current.value;
    inputRef.current.value = '';
    setCities((oldCities) => {
      // check for duplicated cities
      if (oldCities.some((c) => c === userCity)) {
        return oldCities;
      }

      return [...oldCities, userCity];
    });
  };

  const deleteCity = (i: number): void => {
    setCities((oldCities) => {
      oldCities.splice(i, 1);
      return [...oldCities];
    });
  };

  return (
    <div className="popup-container">
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addCity();
        }}
      >
        <InputBase
          inputRef={inputRef}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Add a city"
          inputProps={{ 'aria-label': 'add a city' }}
        />
        <IconButton
          onClick={addCity}
          color="primary"
          sx={{ p: '10px' }}
          aria-label="directions"
        >
          <AddIcon />
        </IconButton>
      </Paper>
      {cities.map((city, i) => (
        <WeatherCard key={i} city={city} onDelete={() => deleteCity(i)} />
      ))}
    </div>
  );
};

export default Popup;
