import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '../../types';
import { RetroButton } from '../ui/RetroButton';

const TRIVIA_DB: TriviaQuestion[] = [
  {
    question: "Which handheld digital pet was a massive craze in the late 90s?",
    options: ["Furby", "Tamagotchi", "Giga Pet", "Digimon"],
    answer: "Tamagotchi",
    fact: "Over 82 million Tamagotchis have been sold worldwide since their release in 1996."
  },
  {
    question: "What was the name of the first cloned mammal, born in 1996?",
    options: ["Molly", "Polly", "Dolly", "Holly"],
    answer: "Dolly",
    fact: "Dolly the sheep was cloned from an adult somatic cell."
  },
  {
    question: "Which movie was the highest-grossing film of the 1990s?",
    options: ["Jurassic Park", "The Lion King", "Titanic", "Star Wars: Episode I"],
    answer: "Titanic",
    fact: "Titanic held the record for highest-grossing film of all time until Avatar in 2009."
  },
  {
    question: "Who sang the hit song '...Baby One More Time' in 1998?",
    options: ["Christina Aguilera", "Britney Spears", "Mandy Moore", "Jessica Simpson"],
    answer: "Britney Spears",
    fact: "The song was originally written for TLC, but they rejected it."
  },
  {
    question: "What video game console did Sony launch in North America in 1995?",
    options: ["PlayStation", "Dreamcast", "Saturn", "Nintendo 64"],
    answer: "PlayStation",
    fact: "The original PlayStation was the first computer entertainment platform to ship 100 million units."
  },
  {
    question: "In 'The Fresh Prince of Bel-Air', what was the name of the butler?",
    options: ["Jeeves", "Alfred", "Geoffrey", "Benson"],
    answer: "Geoffrey",
    fact: "Geoffrey's last name was Butler. Yes, Geoffrey Butler."
  },
  {
    question: "What was the name of the operating system Microsoft released in August 1995?",
    options: ["Windows 95", "Windows NT", "MS-DOS 7.0", "Windows 98"],
    answer: "Windows 95",
    fact: "The startup sound for Windows 95 was composed by Brian Eno."
  },
  {
    question: "Which Beanie Baby was created to honor a royal family member who died in 1997?",
    options: ["Princess", "Diana", "Royal Blue", "Majesty"],
    answer: "Princess",
    fact: "The 'Princess' bear was released in October 1997 to raise funds for the Diana, Princess of Wales Memorial Fund."
  },
  {
    question: "Who defeated Michael Jordan and the Chicago Bulls in the 1995 NBA Playoffs?",
    options: ["New York Knicks", "Orlando Magic", "Indiana Pacers", "Houston Rockets"],
    answer: "Orlando Magic",
    fact: "It was the only playoff series Michael Jordan lost between 1991 and 1998."
  },
  {
    question: "What was the first feature-length computer-animated film, released in 1995?",
    options: ["Antz", "A Bug's Life", "Toy Story", "Shrek"],
    answer: "Toy Story",
    fact: "Toy Story was produced by Pixar and released by Walt Disney Pictures."
  }
];

export const Trivia: React.FC = () => {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const loadQuestion = () => {
    setLoading(true);
    setSelectedOption(null);
    setQuestion(null);
    
    // Simulate CD-ROM seek/loading time
    setTimeout(() => {
      const randomQ = TRIVIA_DB[Math.floor(Math.random() * TRIVIA_DB.length)];
      setQuestion(randomQ);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleAnswer = (option: string) => {
    if (selectedOption || !question) return;
    setSelectedOption(option);
    if (option === question.answer) {
      setScore(s => s + 100);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-2">
      <div className="flex justify-between items-center bg-[#000080] text-white px-2 py-1 font-mono shadow-md">
        <span>TRIVIA.EXE</span>
        <span>SCORE: {score}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {loading && (
          <div className="text-center flex flex-col items-center gap-4">
             <img src="https://win98icons.alexmeub.com/icons/png/cd_drive-4.png" className="w-16 h-16 animate-pulse" />
             <div className="font-bold font-mono text-black">Reading CD-ROM...</div>
          </div>
        )}
        
        {!loading && question && (
          <>
            <div className="bg-yellow-100 border-2 border-black p-4 mb-4 font-serif text-lg text-black font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {question.question}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {question.options.map((opt, idx) => {
                let bgClass = "";
                if (selectedOption) {
                  if (opt === question.answer) bgClass = "bg-green-300";
                  else if (opt === selectedOption) bgClass = "bg-red-300";
                }

                return (
                  <RetroButton 
                    key={idx} 
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selectedOption}
                    className={`justify-start ${bgClass} w-full`}
                  >
                   {String.fromCharCode(65 + idx)}. {opt}
                  </RetroButton>
                );
              })}
            </div>

            {selectedOption && (
              <div className="mt-4 p-2 bg-blue-100 border border-blue-800 text-sm text-black">
                <span className="font-bold">Fact:</span> {question.fact}
                <div className="mt-2 text-center">
                  <RetroButton onClick={loadQuestion}>Next Question &gt;&gt;</RetroButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};