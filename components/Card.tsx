import type { FormHTMLAttributes, HTMLAttributes } from "react";

type CardProps =
  | ({ as?: "div" } & HTMLAttributes<HTMLDivElement>)
  | ({ as: "form" } & FormHTMLAttributes<HTMLFormElement>);

export default function Card({ className, as = "div", ...props }: CardProps) {
  const classes = ["rounded-3xl border border-border bg-surface p-6", className]
    .filter(Boolean)
    .join(" ");

  if (as === "form") {
    return <form className={classes} {...(props as FormHTMLAttributes<HTMLFormElement>)} />;
  }

  return <div className={classes} {...(props as HTMLAttributes<HTMLDivElement>)} />;
}
