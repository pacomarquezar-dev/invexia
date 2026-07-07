"use client";

import { useState } from "react";
import { calculateInvestorProfile, investorProfileQuestions, investorProfiles } from "@/lib/investorProfile";
import {
  clearInvestorProfileResult,
  loadInvestorProfileResult,
  saveInvestorProfileResult,
  type StoredInvestorProfileResult,
} from "@/lib/investorProfileStorage";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";

const TOTAL_QUESTIONS = investorProfileQuestions.length;

function createEmptyAnswers(): Array<number | null> {
  return Array(TOTAL_QUESTIONS).fill(null);
}

/**
 * Este componente solo se monta en cliente (ver InvestorProfileQuizLoader,
 * que lo importa con next/dynamic y ssr:false), así que leer localStorage
 * de forma síncrona aquí es seguro y no necesita useEffect.
 */
export default function InvestorProfileQuiz() {
  const [result, setResult] = useState<StoredInvestorProfileResult | null>(() =>
    loadInvestorProfileResult(),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(createEmptyAnswers);

  function handleSelect(optionIndex: number) {
    setAnswers((previous) => {
      const next = [...previous];
      next[currentQuestionIndex] = optionIndex;
      return next;
    });
  }

  function handleNext() {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex((index) => index + 1);
      return;
    }

    const finalAnswers = answers.map((answer) => answer ?? 0);
    const { totalScore, profile } = calculateInvestorProfile(finalAnswers);
    const newResult: StoredInvestorProfileResult = {
      profile,
      totalScore,
      completedAt: new Date().toISOString(),
    };
    saveInvestorProfileResult(newResult);
    setResult(newResult);
  }

  function handleBack() {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  }

  function handleRestart() {
    clearInvestorProfileResult();
    setResult(null);
    setAnswers(createEmptyAnswers());
    setCurrentQuestionIndex(0);
  }

  if (result) {
    return (
      <ResultCard
        profile={investorProfiles[result.profile]}
        totalScore={result.totalScore}
        onRestart={handleRestart}
      />
    );
  }

  const currentQuestion = investorProfileQuestions[currentQuestionIndex];

  return (
    <QuestionCard
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={TOTAL_QUESTIONS}
      selectedOptionIndex={answers[currentQuestionIndex]}
      onSelect={handleSelect}
      onNext={handleNext}
      onBack={currentQuestionIndex > 0 ? handleBack : undefined}
      isLastQuestion={currentQuestionIndex === TOTAL_QUESTIONS - 1}
    />
  );
}
