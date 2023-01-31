import {
  clearWeatherDataLocalStorage,
  persistCitiesToLocalStorage,
  persistScaleToLocalStorage,
} from '@src/utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  persistCitiesToLocalStorage([]);
  clearWeatherDataLocalStorage();
  persistScaleToLocalStorage('c');
});
