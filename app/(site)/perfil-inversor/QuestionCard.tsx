"use client";

import type { QuizQuestion } from "@/lib/investorProfile";
import Button from "@/components/Button";
import Card from "@/components/Card";

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
    <Card className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">
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
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-lg font-semibold text-foreground">{question.question}</legend>
        {question.options.map((option, index) => {
          const inputId = `${question.id}-option-${index}`;
          const isSelected = selectedOptionIndex === index;

          return (
            <label
              key={option.label}
              htmlFor={inputId}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                isSelected ? "border-accent bg-accent/10" : "border-border hover:bg-foreground/5"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={question.id}
                checked={isSelected}
                onChange={() => onSelect(index)}
                className="mt-1 accent-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          );
        })}
      </fieldset>

      <div className="flex justify-between gap-3">
        {onBack ? (
          <Button type="button" variant="secondary" onClick={onBack}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={selectedOptionIndex === null}
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastQuestion ? "Ver resultado" : "Siguiente"}
        </Button>
      </div>
    </Card>
  );
}
