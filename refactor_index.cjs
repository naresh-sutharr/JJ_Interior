const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'src/routes/index.tsx');
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Add new imports
const newImports = `
import jjLogo from "@/assets/jj_logo.jpg";
import mukeshPhoto from "@/assets/mukesh_photo1.jpg";
import { useRows } from "@/hooks/use-admin";
`;
content = content.replace('import materialImage from "@/assets/material-study.jpg";', 'import materialImage from "@/assets/material-study.jpg";\n' + newImports);

// 2. Remove hardcoded projects array and add dynamic hook inside Index()
const hardcodedProjectsRegex = /const projects = \[\s*\{.*?\}\s*\];/s;
content = content.replace(hardcodedProjectsRegex, '');

const indexFunctionStart = 'function Index() {\n  const scrolled = usePageEffects();';
const newIndexFunctionStart = `function Index() {\n  const scrolled = usePageEffects();\n  const { data: dynamicProjects = [] } = useRows('projects');\n\n  // Combine dynamic projects with defaults if none exist yet\n  const projects = dynamicProjects.length > 0 ? dynamicProjects : [\n    { name: "The Aster Residence", location: "Mumbai", year: "2026", type: "Luxury Residence", image: residenceImage, vertical: true },\n    { name: "Villa Sereno", location: "Goa", year: "2025", type: "Modern Villa", image: villaImage, vertical: false },\n  ];`;
content = content.replace(indexFunctionStart, newIndexFunctionStart);

// 3. Update the header logo
const oldLogoButton = '<button onClick={() => scrollTo("home")} className="w-fit cursor-pointer text-left display-serif text-xl tracking-normal md:text-2xl" aria-label="J.J. INTERIORS & MODUTECH home">J.J. INTERIORS & MODUTECH</button>';
const newLogoButton = `<button onClick={() => scrollTo("home")} className="flex items-center gap-3 w-fit cursor-pointer text-left display-serif text-xl tracking-normal md:text-2xl" aria-label="J.J. INTERIORS & MODUTECH home">\n            <img src={jjLogo} alt="J.J. Interiors Logo" className="h-12 w-auto object-contain rounded" />\n            <span className="hidden md:inline-block">J.J. INTERIORS & MODUTECH</span>\n          </button>`;
content = content.replace(oldLogoButton, newLogoButton);

// 4. Make Admin Button premium
const oldAdminButton = `<Button variant="ghost" className="hidden h-10 px-4 text-[10px] uppercase tracking-[.18em] text-champagne hover:text-champagne/80 hover:bg-transparent md:inline-flex" asChild>\n              <a href="/admin/login">Admin Portal</a>\n            </Button>`;
const newAdminButton = `<Button className="hidden h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-900 text-white shadow-lg shadow-amber-900/40 border-0 px-6 text-[10px] font-bold uppercase tracking-[.18em] hover:scale-105 transition-all duration-300 md:inline-flex" asChild>\n              <a href="/admin/login">Admin Portal \u2728</a>\n            </Button>`;
content = content.replace(oldAdminButton, newAdminButton);

// 5. Replace portraitImage with mukeshPhoto in About section
content = content.replace('src={portraitImage} alt="Creative director', 'src={mukeshPhoto} alt="Mukesh bhai Suthar');

fs.writeFileSync(indexFile, content);
console.log("Refactored index.tsx");
