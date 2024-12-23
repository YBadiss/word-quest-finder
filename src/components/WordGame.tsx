import React, { useState, useEffect } from 'react';
import { getRandomWord } from '../services/wordService';
import { getWordProximity } from '../services/openaiService';
import { toast } from 'sonner';

const WordGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(6);
  const [guesses, setGuesses] = useState<Array<{ word: string; proximity: number }>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { word, definition } = getRandomWord();
    setCurrentWord(word);
    setDefinition(definition);
  }, []);

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guess.length === 0) return;
    
    if (guess.length !== currentWord.length) {
      toast.error(`Le mot doit contenir ${currentWord.length} lettres !`);
      return;
    }

    setIsLoading(true);
    const upperGuess = guess.toUpperCase();
    
    // Check for exact match first
    if (upperGuess === currentWord) {
      setGuesses([...guesses, { word: upperGuess, proximity: 100 }]);
      setGuess('');
      setWon(true);
      setGameOver(true);
      setIsLoading(false);
      toast.success("Félicitations ! Vous avez trouvé le mot !");
      return;
    }

    // If not an exact match, proceed with API call
    const proximity = await getWordProximity(upperGuess, currentWord);
    setGuesses([...guesses, { word: upperGuess, proximity }]);
    setGuess('');
    setIsLoading(false);

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (newAttempts === 0) {
      setGameOver(true);
      toast.error(`Partie terminée ! Le mot était ${currentWord}`);
    }
  };

  const renderWordGrid = () => {
    return guesses.map((guess, i) => (
      <div key={i} className="flex gap-2 mb-2 items-center">
        <div className="flex gap-2">
          {guess.word.split('').map((letter, j) => (
            <div
              key={`${i}-${j}`}
              className="w-12 h-12 flex items-center justify-center text-xl font-mono border-2 border-gray-200 bg-gray-100"
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="ml-4 text-lg font-semibold">
          {guess.proximity}% de proximité
        </div>
      </div>
    ));
  };

  const renderEmptyRows = () => {
    const emptyRows = 6 - guesses.length;
    return Array(emptyRows).fill(null).map((_, i) => (
      <div key={`empty-${i}`} className="flex gap-2 mb-2">
        {Array(currentWord.length).fill(null).map((_, j) => (
          <div
            key={`empty-${i}-${j}`}
            className="w-12 h-12 flex items-center justify-center text-xl font-mono border-2 border-gray-200"
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Jeu de Devinettes de Mots</h1>
        <div className="space-y-2 text-gray-600">
          <p>Longueur du mot : <span className="font-semibold">{currentWord.length}</span></p>
          <p>Première lettre : <span className="font-semibold">{currentWord[0]}</span></p>
          <p>Définition : <span className="font-semibold">{definition}</span></p>
          <p>Tentatives restantes : <span className="font-semibold">{attempts}</span></p>
        </div>
      </div>

      <div className="mb-8">
        {renderWordGrid()}
        {!gameOver && renderEmptyRows()}
      </div>

      {!gameOver && (
        <form onSubmit={handleGuess} className="flex gap-2">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            maxLength={currentWord.length}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder={`Entrez un mot de ${currentWord.length} lettres`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Analyse...' : 'Deviner'}
          </button>
        </form>
      )}

      {gameOver && (
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Rejouer
        </button>
      )}
    </div>
  );
};

export default WordGame;