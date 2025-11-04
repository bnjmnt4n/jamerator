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
