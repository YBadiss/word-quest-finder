export const getWordProximity = async (userGuess: string, word: string): Promise<number> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: `Tu es un expert linguistique. Donne moi la proximite de 1 a 100 (100 etant exactement le bon mot) entre "${userGuess}" et "${word}". REPONDS UNIQUEMENT AVEC LA VALEUR DE PROXIMITE ET RIEN D'AUTRE.`
        }],
      }),
    });

    const data = await response.json();
    const proximityStr = data.choices[0].message.content.trim();
    const proximity = parseInt(proximityStr, 10);
    
    return isNaN(proximity) ? 0 : proximity;
  } catch (error) {
    console.error('Error getting word proximity:', error);
    return 0;
  }
};