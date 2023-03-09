import { Paper, InputBase, Divider } from '@mui/material';
import React, { FormEvent, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import NearMeIcon from '@mui/icons-material/NearMe';
import IconButton from '@mui/material/IconButton/IconButton';
import { getLocation } from '@src/utils/geolocation';
import { Coord } from '@src/utils/api';
import CircularProgress from '@mui/material/CircularProgress';

export type Scale = 'c' | 'f';

export type MainInputProps = {
  onAddCity?: (city: string) => void;
  onScaleChange?: (newScale: Scale) => void;
  onGetUserLocation?: (userLocation: Coord) => void;
};

const MainInput: React.FC<MainInputProps> = (props) => {
  const { onAddCity, onScaleChange, onGetUserLocation } = props;
  const [scale, setScale] = useState<Scale>('c');
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>();

  const addCity = () => {
    if (!inputRef.current) {
      return;
    }

    const addedCity = inputRef.current.value;
    if (!addedCity) {
      return;
    }

    inputRef.current.value = '';
    if (onAddCity) {
      onAddCity(addedCity);
    }
  };

  const toggleScale = (): void => {
    const newScale = scale === 'c' ? 'f' : 'c';

    setScale(newScale);

    if (onScaleChange) {
      onScaleChange(newScale);
    }
  };

  const getUserLocation = async (): Promise<void> => {
    if (!onGetUserLocation) return;

    setIsGettingLocation(true);
    const userLocation = await getLocation();
    setIsGettingLocation(false);
    onGetUserLocation({
      lon: userLocation.coords.longitude,
      lat: userLocation.coords.latitude,
    });
  };

  return (
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
        onClick={toggleScale}
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
      <IconButton
        onClick={addCity}
        color="primary"
        sx={{ p: '10px' }}
        aria-label="add city"
      >
        <AddIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      {isGettingLocation ? (
        <CircularProgress />
      ) : (
        <IconButton
          onClick={getUserLocation}
          color="primary"
          sx={{ p: '10px' }}
          aria-label="add current location"
        >
          <NearMeIcon />
        </IconButton>
      )}
    </Paper>
  );
};
export default MainInput;
