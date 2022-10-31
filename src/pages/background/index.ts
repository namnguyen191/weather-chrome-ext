import {
  persistCitiesToLocalStorage,
  persistScaleToLocalStorage,
} from '@src/utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  persistCitiesToLocalStorage([]);
  persistScaleToLocalStorage('c');
});
