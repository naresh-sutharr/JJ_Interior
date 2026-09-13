const fs = require('fs');
let code = fs.readFileSync('src/routes/admin.billing.tsx', 'utf8');

// 1. Remove the misplaced imports inside BillHeaderLogo
code = code.replace(/import { Plus, Trash2[\s\S]*?from '@\/utils\/pdfExport';\n/g, "");

// 2. Add the missing closing tags for BillHeaderLogo
code = code.replace(/<path d="M 220 260 Q 243 250 233 235 Q 220 243 220 260 Z" fill="#588162" \/>/g, 
  `<path d="M 220 260 Q 243 250 233 235 Q 220 243 220 260 Z" fill="#588162" />
    <path d="M 221 230 Q 206 215 214 205 Q 224 212 221 230 Z" fill="#3d5a43" />
    <path d="M 226 212 Q 242 204 236 191 Q 226 196 226 212 Z" fill="#7fa687" />
  </svg>
);
`);

// 3. Insert the imports correctly at the top
const importsToAdd = `import { Plus, Trash2, Download, Save, PlusCircle, User, FileText, Calendar, IndianRupee, Search, MapPin, Phone, FolderPlus, CreditCard, ChevronDown, Check, Edit2 } from 'lucide-react';\nimport { logoBase64 } from '@/utils/logoBase64';\nimport { downloadPDF } from '@/utils/pdfExport';\n`;

code = code.replace('import { toast } from "sonner";', 'import { toast } from "sonner";\n' + importsToAdd);

// 4. Also remove the duplicated SVG declarations that were added at the bottom of the file or wherever they ended up!
// Looking at the multi_replace output, it re-added GaneshaSVG, SofaSVG, BillHeaderLogo right after the imports!
// Let's just remove the first definitions, or better yet, I will write a precise regex or just reconstruct the file.

// Instead of patching a horribly broken file, let's just re-run the original refactor from Billing.jsx to admin.billing.tsx!
