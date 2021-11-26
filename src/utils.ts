/**
 * Generates a unique random id string when called
 */
export const uid = () => Math.random().toString(36).substr(2, 9);

/**
 * Generates an array with consecutive numbers from start to end range
 * @param start Start Number
 * @param end End Number
 */
export const generateRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
