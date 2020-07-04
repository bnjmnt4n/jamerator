import range from 'lodash/range';
import shuffle from 'lodash/shuffle';

export function pluralize(number, item) {
  return `${number} ${item}${number === 1 ? '' : 's'}`;
}

export function readableTime(total_time) {
  const hours = Math.floor(total_time / 60);
  const minutes = total_time % 60;
  let time = [];

  if (hours) {
    time.push(pluralize(hours, 'hour'));
  }
  if (!hours || (hours && minutes)) {
    time.push(pluralize(minutes, 'minute'));
  }

  return time.join(' ');
}

export function generateShuffledArray(length) {
  const array = range(length);
  const shuffled = shuffle(array);

  return shuffled;
}

// Simple feature detection based on Modernizr:
// https://github.com/Modernizr/Modernizr/blob/e2c27dcd32d6185846ce3c6c83d7634cfa402d19/feature-detects/storage/localstorage.js
const localStorageExists = (function() {
  const test = '__TEST__';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (_) {
    return false;
  }
}());

// A simple `localStorage` wrapper.
export const DataStore = {
  get: (key, defaultValue) => {
    return localStorageExists ? (localStorage.getItem(key) || defaultValue) : defaultValue;
  },
  set: (key, value) => {
    return localStorageExists && localStorage.setItem(key, value);
  }
};
