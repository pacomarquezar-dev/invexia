"use client";

import dynamic from "next/dynamic";

const InvestorProfileQuiz = dynamic(() => import("./InvestorProfileQuiz"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-64" />,
});

export default function InvestorProfileQuizLoader() {
  return <InvestorProfileQuiz />;
}
