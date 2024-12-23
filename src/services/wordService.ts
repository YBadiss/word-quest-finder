interface WordInfo {
  word: string;
  definition: string;
}

const words: WordInfo[] = [
  { word: "APPLE", definition: "A round fruit with red or green skin and white flesh" },
  { word: "BEACH", definition: "A sandy or pebbly shore, especially by the sea" },
  { word: "CLOUD", definition: "A visible mass of water droplets in the atmosphere" },
  { word: "DANCE", definition: "Move rhythmically to music" },
  { word: "EAGLE", definition: "A large bird of prey with a massive hooked bill" },
];

export const getRandomWord = (): WordInfo => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};