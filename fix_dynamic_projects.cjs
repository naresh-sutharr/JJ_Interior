const fs = require('fs');
const file = 'src/routes/_public.index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add useRows import
content = content.replace('import bespokeImage from "@/assets/project-bespoke.jpg";', 'import bespokeImage from "@/assets/project-bespoke.jpg";\nimport { useRows } from "@/hooks/use-admin";');

// Use useRows in the component
content = content.replace(
  '  const projects = [\n    { name: "The Aster Residence", location: "Surat, Gujarat", type: "Luxury Residence", image: residenceImage },\n    { name: "Villa Sereno", location: "Mumbai", type: "Modern Villa", image: villaImage },\n    { name: "One Meridian", location: "Ahmedabad", type: "Contemporary Office", image: officeImage },\n    { name: "Maison Privée", location: "Surat, Gujarat", type: "Bespoke Interior", image: bespokeImage },\n  ];',
  `  const { data: dynamicProjects = [] } = useRows("projects");
  
  // Mix dynamic projects from the admin panel with defaults if less than 4 exist
  const projects = dynamicProjects.length > 0 ? dynamicProjects.map(p => ({
    name: p.name,
    location: p.location || "Surat, Gujarat",
    type: p.project_type || "Interior Project",
    image: p.cover_image_url || residenceImage
  })) : [
    { name: "The Aster Residence", location: "Surat, Gujarat", type: "Luxury Residence", image: residenceImage },
    { name: "Villa Sereno", location: "Mumbai", type: "Modern Villa", image: villaImage },
    { name: "One Meridian", location: "Ahmedabad", type: "Contemporary Office", image: officeImage },
    { name: "Maison Privée", location: "Surat, Gujarat", type: "Bespoke Interior", image: bespokeImage },
  ];`
);

fs.writeFileSync(file, content);
console.log("Updated _public.index.tsx to use dynamic projects");
