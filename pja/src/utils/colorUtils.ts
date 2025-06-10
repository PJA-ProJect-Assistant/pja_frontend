export const getSequentialColor = (colorArray: string[], index: number) => {
  const adjustedIndex = index % colorArray.length;
  return colorArray[adjustedIndex];
};

export function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
