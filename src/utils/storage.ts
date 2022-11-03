import {
  WeatherDataAPIResponse,
  WeatherDataAPIResponseWithTimeStamp,
} from './api';

export type LocalStorageData = {
  cities: string[];
  scale: 'c' | 'f';
  weathers: { [city: string]: WeatherDataAPIResponseWithTimeStamp };
};

export type LocalStorageKeys = keyof LocalStorageData;

export const persistCitiesToLocalStorage = async (
  cities: string[]
): Promise<void> => {
  await chrome.storage.local.set({ cities });
};

export const getCitiesFromLocalStorage = async (): Promise<string[]> => {
  const citiesKey: LocalStorageKeys[] = ['cities'];
  const data: LocalStorageData = (await chrome.storage.local.get(
    citiesKey
  )) as LocalStorageData;

  return data.cities;
};

export const persistScaleToLocalStorage = async (
  scale: 'c' | 'f'
): Promise<void> => {
  await chrome.storage.local.set({ scale });
};

export const getScaleFromLocalStorage = async (): Promise<'c' | 'f'> => {
  const scaleKey: LocalStorageKeys[] = ['scale'];
  const data: LocalStorageData = (await chrome.storage.local.get(
    scaleKey
  )) as LocalStorageData;

  return data.scale;
};

export const persistWeatherDataToLocalStorage = async (
  city: string,
  data: WeatherDataAPIResponseWithTimeStamp
): Promise<void> => {
  const weatherKey: LocalStorageKeys[] = ['weathers'];

  const oldData: LocalStorageData = (await chrome.storage.local.get(
    weatherKey
  )) as LocalStorageData;
  await chrome.storage.local.set({
    weathers: { ...oldData.weathers, [city]: data },
  });
};

export const getWeatherDataFromLocalStorage = async (
  city: string
): Promise<WeatherDataAPIResponseWithTimeStamp | undefined> => {
  const weatherKey: LocalStorageKeys[] = ['weathers'];
  const data: LocalStorageData = (await chrome.storage.local.get(
    weatherKey
  )) as LocalStorageData;

  return data?.weathers?.[city];
};
