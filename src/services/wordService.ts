interface WordInfo {
  word: string;
  definition: string;
}

const words: WordInfo[] = [
  { word: "POMME", definition: "Un fruit rond avec une peau rouge ou verte et une chair blanche" },
  { word: "PLAGE", definition: "Une étendue de sable ou de galets au bord de la mer" },
  { word: "NUAGE", definition: "Une masse visible de gouttelettes d'eau dans l'atmosphère" },
  { word: "DANSE", definition: "Bouger rythmiquement sur de la musique" },
  { word: "AIGLE", definition: "Un grand oiseau de proie avec un bec crochu massif" },
];

export const getRandomWord = (): WordInfo => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};