import React, { useState, useEffect } from 'react';
import { getRandomWord } from '../services/wordService';
import { toast } from 'sonner';

const WordGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const { word, definition } = getRandomWord();
    setCurrentWord(word);
    setDefinition(definition);
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guess.length === 0) return;
    
    if (guess.length !== currentWord.length) {
      toast.error(`The word must be ${currentWord.length} letters long!`);
      return;
    }

    const upperGuess = guess.toUpperCase();
    setGuesses([...guesses, upperGuess]);
    setGuess('');
    
    if (upperGuess === currentWord) {
      setWon(true);
      setGameOver(true);
      toast.success("Congratulations! You found the word!");
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (newAttempts === 0) {
      setGameOver(true);
      toast.error(`Game Over! The word was ${currentWord}`);
    }
  };

  const renderWordGrid = () => {
    return guesses.map((guessWord, i) => (
      <div key={i} className="flex gap-2 mb-2">
        {guessWord.split('').map((letter, j) => (
          <div
            key={`${i}-${j}`}
            className={`w-12 h-12 flex items-center justify-center text-xl font-mono border-2 
              ${letter === currentWord[j] ? 'bg-green-500 text-white border-green-600' : 
                currentWord.includes(letter) ? 'bg-yellow-500 text-white border-yellow-600' : 
                'bg-gray-200 text-gray-700 border-gray-300'} 
              animate-pop`}
          >
            {letter}
          </div>
        ))}
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
        <h1 className="text-3xl font-bold mb-4">Word Guessing Game</h1>
        <div className="space-y-2 text-gray-600">
          <p>Word length: <span className="font-semibold">{currentWord.length}</span></p>
          <p>First letter: <span className="font-semibold">{currentWord[0]}</span></p>
          <p>Definition: <span className="font-semibold">{definition}</span></p>
          <p>Remaining attempts: <span className="font-semibold">{attempts}</span></p>
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
            placeholder={`Enter a ${currentWord.length}-letter word`}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Guess
          </button>
        </form>
      )}

      {gameOver && (
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default WordGame;