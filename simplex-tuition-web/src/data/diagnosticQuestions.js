export const questions = {
  maths: {
    primary: [
      { id: 'm-p-1', question: 'What is 347 + 258?', options: ['595', '605', '505', '615'], answer: '605' },
      { id: 'm-p-2', question: 'What is ½ of 84?', options: ['42', '44', '40', '48'], answer: '42' },
      { id: 'm-p-3', question: 'Which is largest: ¾, ½, ⅔?', options: ['¾', '½', '⅔', 'They are equal'], answer: '¾' },
      { id: 'm-p-4', question: 'What is 6 × 8?', options: ['42', '48', '54', '56'], answer: '48' },
      { id: 'm-p-5', question: 'A rectangle is 9cm long and 4cm wide. What is its area?', options: ['26cm²', '36cm²', '13cm²', '32cm²'], answer: '36cm²' },
      { id: 'm-p-6', question: 'What is 15% of 200?', options: ['25', '30', '35', '20'], answer: '30' },
      { id: 'm-p-7', question: 'Round 4,567 to the nearest hundred.', options: ['4,500', '4,600', '4,570', '5,000'], answer: '4,600' },
      { id: 'm-p-8', question: 'If a bag of apples costs $3.50, how much do 4 bags cost?', options: ['$12.00', '$14.00', '$13.50', '$16.00'], answer: '$14.00' },
    ],
    high: [
      { id: 'm-h-1', question: 'Solve for x: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 4', 'x = 6'], answer: 'x = 5' },
      { id: 'm-h-2', question: 'What is the gradient of the line y = 4x - 3?', options: ['4', '-3', '3', '-4'], answer: '4' },
      { id: 'm-h-3', question: 'Expand: (x + 3)(x - 2)', options: ['x² + x - 6', 'x² - x + 6', 'x² + x + 6', 'x² - 5x - 6'], answer: 'x² + x - 6' },
      { id: 'm-h-4', question: 'What is sin(30°)?', options: ['½', '√3/2', '1/√2', '√3'], answer: '½' },
      { id: 'm-h-5', question: 'Simplify: (x³ × x⁴) ÷ x²', options: ['x⁵', 'x⁹', 'x⁷', 'x⁶'], answer: 'x⁵' },
      { id: 'm-h-6', question: 'Find the area of a circle with radius 5cm. (Use π ≈ 3.14)', options: ['78.5cm²', '31.4cm²', '15.7cm²', '62.8cm²'], answer: '78.5cm²' },
      { id: 'm-h-7', question: 'If f(x) = 2x² - 3, what is f(4)?', options: ['29', '21', '13', '35'], answer: '29' },
      { id: 'm-h-8', question: 'Solve: x² - 5x + 6 = 0', options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = 2 or x = -3'], answer: 'x = 2 or x = 3' },
    ],
  },
  english: {
    primary: [
      { id: 'e-p-1', question: 'Which sentence uses a comma correctly?', options: ['I like cats, dogs and fish.', 'I like, cats dogs and fish.', 'I, like cats dogs and fish.', 'I like cats dogs, and fish.'], answer: 'I like cats, dogs and fish.' },
      { id: 'e-p-2', question: 'What is the noun in this sentence: "The quick brown fox jumps."', options: ['quick', 'brown', 'fox', 'jumps'], answer: 'fox' },
      { id: 'e-p-3', question: 'Which word is a synonym for "happy"?', options: ['sad', 'angry', 'joyful', 'tired'], answer: 'joyful' },
      { id: 'e-p-4', question: 'Which sentence is written in the past tense?', options: ['She runs to school.', 'She ran to school.', 'She will run to school.', 'She is running to school.'], answer: 'She ran to school.' },
      { id: 'e-p-5', question: 'What type of text is a recipe?', options: ['Narrative', 'Persuasive', 'Procedural', 'Descriptive'], answer: 'Procedural' },
      { id: 'e-p-6', question: 'Which word is an adjective in: "The tall building stood quietly."', options: ['building', 'stood', 'tall', 'quietly'], answer: 'tall' },
      { id: 'e-p-7', question: 'Which sentence has correct punctuation?', options: ["its a nice day.", "It's a nice day.", "Its a nice day.", "It's a Nice day."], answer: "It's a nice day." },
      { id: 'e-p-8', question: 'What is the main purpose of a persuasive text?', options: ['To entertain', 'To inform', 'To convince', 'To describe'], answer: 'To convince' },
    ],
    high: [
      { id: 'e-h-1', question: 'What literary device is used in: "The wind whispered through the trees"?', options: ['Simile', 'Personification', 'Metaphor', 'Alliteration'], answer: 'Personification' },
      { id: 'e-h-2', question: 'Which best describes the tone of a eulogy?', options: ['Sarcastic', 'Celebratory and mournful', 'Angry', 'Humorous'], answer: 'Celebratory and mournful' },
      { id: 'e-h-3', question: 'What is the effect of a short, punchy sentence in persuasive writing?', options: ['Creates confusion', 'Slows the pace', 'Creates emphasis and impact', 'Shows the writer is lazy'], answer: 'Creates emphasis and impact' },
      { id: 'e-h-4', question: 'Which sentence uses the subjunctive mood?', options: ['If I was taller, I would play basketball.', 'If I were taller, I would play basketball.', 'I am taller than him.', 'She was tall.'], answer: 'If I were taller, I would play basketball.' },
      { id: 'e-h-5', question: '"All politicians are corrupt" is an example of:', options: ['A valid argument', 'A hasty generalisation', 'A rhetorical question', 'An anecdote'], answer: 'A hasty generalisation' },
      { id: 'e-h-6', question: 'In an essay, the purpose of a topic sentence is to:', options: ['Conclude the paragraph', 'Introduce the main idea of the paragraph', 'Provide evidence', 'Link to the next paragraph'], answer: 'Introduce the main idea of the paragraph' },
      { id: 'e-h-7', question: 'Which is an example of dramatic irony?', options: ['A character says one thing but means another', "The audience knows something the character doesn't", 'An unexpected twist at the end', 'Two characters misunderstand each other'], answer: "The audience knows something the character doesn't" },
      { id: 'e-h-8', question: 'The term "juxtaposition" means:', options: ['Using exaggeration for effect', 'Placing contrasting ideas side by side', 'Repeating a word for emphasis', 'Describing one thing as another'], answer: 'Placing contrasting ideas side by side' },
    ],
  },
}

export function getQuestions(subject, schoolLevel) {
  return questions[subject]?.[schoolLevel] ?? []
}
