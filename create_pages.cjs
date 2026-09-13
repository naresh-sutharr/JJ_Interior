const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

const createPage = (name, content) => {
  fs.writeFileSync(path.join(routesDir, `_public.${name.toLowerCase()}.tsx`), content);
};

const template = (name, desc) => `import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/${name.toLowerCase()}")({
  component: ${name}Page,
});

function ${name}Page() {
  return (
    <div className="min-h-[70vh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center pt-32 pb-20 px-6">
      <h1 className="font-display text-5xl md:text-7xl mb-6 premium-gradient-text animate-fade-in-up">${name}</h1>
      <p className="text-white/60 max-w-2xl text-center leading-relaxed animate-fade-in-up delay-100">${desc}</p>
    </div>
  );
}
`;

createPage('About', 'Learn about Mukesh bhai Suthar and the vision behind JAY JASOL INTERIORS & MODUTECH.');
createPage('Projects', 'Explore our curated portfolio of luxury interior and architectural designs.');
createPage('Services', 'Discover our comprehensive interior design, modutech, and turnkey solutions.');
createPage('Contact', 'Get in touch with our studio in Surat, Gujarat. We look forward to designing your next space.');

console.log("Created public pages.");
