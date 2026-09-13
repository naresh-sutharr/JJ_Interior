import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-[70vh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center pt-32 pb-20 px-6">
      <h1 className="font-display text-5xl md:text-7xl mb-6 premium-gradient-text animate-fade-in-up">About</h1>
      <p className="text-white/60 max-w-2xl text-center leading-relaxed animate-fade-in-up delay-100">
        Learn about Mukesh bhai Suthar and the vision behind JAY JASOL INTERIORS & MODUTECH.
      </p>
    </div>
  );
}