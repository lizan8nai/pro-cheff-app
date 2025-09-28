import "./globals.css";

export const metadata = {
  title: "MealPlan — Daily Coach",
  description: "Planes de comida elegantes y accionables",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body>{children}</body>
    </html>
  );
}