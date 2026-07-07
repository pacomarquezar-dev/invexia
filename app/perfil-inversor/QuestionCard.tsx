"use client";

import type { QuizQuestion } from "@/lib/investorProfile";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionIndex: number | null;
  onSelect: (optionIndex: number) => void;
  onNext: () => void;
  onBack?: () => void;
  isLastQuestion: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIndex,
  onSelect,
  onNext,
  onBack,
  isLastQuestion,
}: QuestionCardProps) {
  const progressPercent = (questionNumber / totalQuestions) * 100;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-foreground/10 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/70">
          Pregunta {questionNumber} de {totalQuestions}
        </p>
        <div
          role="progressbar"
          aria-valuenow={questionNumber}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          className="h-2 w-full rounded-full bg-foreground/10"
        >
          <div
            className="h-2 rounded-full bg-foreground transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-lg font-medium">{question.question}</legend>
        {question.options.map((option, index) => {
          const inputId = `${question.id}-option-${index}`;
          const isSelected = selectedOptionIndex === index;

          return (
            <label
              key={option.label}
              htmlFor={inputId}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={question.id}
                checked={isSelected}
                onChange={() => onSelect(index)}
                className="mt-1"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </fieldset>

      <div className="flex justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Atrás
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={selectedOptionIndex === null}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastQuestion ? "Ver resultado" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
