import shuffle from "lodash/shuffle";

export function readableTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.round((ms % (1000 * 60 * 60)) / (1000 * 60));
  let time = [];

  if (hours) {
    time.push(`${hours}h`);
  }
  if (!hours || (hours && minutes)) {
    time.push(`${minutes}m`);
  }

  return time.join(" ");
}

export function generateShuffledArray(length) {
  const array = Array.from({ length }, (_, i) => i);
  const shuffled = shuffle(array);

  return shuffled;
}
