export type LocalStorageData = {
  cities: string[];
  scale: 'c' | 'f';
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
