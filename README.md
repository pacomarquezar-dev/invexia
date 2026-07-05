# Invexia

Web en español de finanzas personales: calculadoras interactivas, glosario y un chatbot educativo. Ver [claude.md](./claude.md) para el contexto completo del proyecto y las convenciones a seguir.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run start` — sirve el build de producción.
- `npm run lint` — ESLint.
- `npm run test` — Vitest (fórmulas y lógica de negocio en `/lib`).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, desplegado en Vercel. Sin base de datos: el estado de usuario vive en `localStorage`.
