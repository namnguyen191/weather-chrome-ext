export const celToFar = (degreeC: number): number => {
  return (degreeC * 9) / 5 + 32;
};

export const farToCel = (degreeF: number): number => {
  return ((degreeF - 32) * 5) / 9;
};
