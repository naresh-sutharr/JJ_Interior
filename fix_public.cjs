const fs = require('fs');
const file = 'src/routes/_public.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Logo import
content = content.replace('import jayJasolLogo from "@/assets/jay_jasol_logo.jpg";', 'import jayJasolLogo from "@/assets/jay_jasol_logo.png";');

// Fix brand name and logo in navbar
content = content.replace(
  '<Link to="/" className="flex items-center gap-3 w-fit cursor-pointer animate-fade-in-up">\n            <img \n              src={jayJasolLogo} \n              alt="Jay Jasol Interiors & Modutech Logo" \n              className="h-16 w-auto object-contain rounded drop-shadow-2xl" \n            />\n          </Link>',
  `<Link to="/" className="flex items-center gap-4 w-fit cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={jayJasolLogo} 
              alt="Jay Jasol Interiors & Modutech Logo" 
              className="h-14 w-auto object-contain drop-shadow-2xl bg-white/10 rounded-sm p-1" 
            />
            <span className="hidden md:block font-display text-2xl tracking-widest text-white/90">
              JAY JASOL <span className="text-[#d4af37]">INTERIORS</span>
            </span>
          </Link>`
);

// Fix other animate classes
content = content.replace(/animate-fade-in-up delay-100/g, 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both');
content = content.replace(/animate-fade-in-up delay-200/g, 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both');
content = content.replace(/animate-fade-in-up/g, 'animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both');

fs.writeFileSync(file, content);
console.log("Updated _public.tsx");
