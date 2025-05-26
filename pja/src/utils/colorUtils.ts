export const getRandomColor = (colorArray: string[]) => {
  return colorArray[Math.floor(Math.random() * colorArray.length)];
};
