import { Paper, InputBase, Divider } from '@mui/material';
import React, { FormEvent, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton/IconButton';

export type Scale = 'c' | 'f';

export type MainInputProps = {
  onAddCity?: (city: string) => void;
  onScaleChange?: (newScale: Scale) => void;
};

const MainInput: React.FC<MainInputProps> = (props) => {
  const { onAddCity, onScaleChange } = props;
  const [scale, setScale] = useState<Scale>('c');

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
  );
};
export default MainInput;
