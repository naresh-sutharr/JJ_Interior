const fs = require('fs');
const file = 'src/routes/admin._panel.billing.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add mobileStep state
content = content.replace(
  "const [billNo, setBillNo] = useState('');",
  "const [billNo, setBillNo] = useState('');\n  const [mobileStep, setMobileStep] = useState(1);"
);

// 2. Hide/Show Left Column Cards based on mobileStep
content = content.replace(
  '{/* Card 1: Bill Type Toggle & Client details */}\n            <div className="glass-card p-6 rounded-2xl',
  '{/* Card 1: Bill Type Toggle & Client details */}\n            <div className={`glass-card p-6 rounded-2xl ${mobileStep !== 1 ? "hidden md:block" : ""}`}'
);

content = content.replace(
  '{/* Card 2: Date & Invoice No */}\n            <div className="glass-card p-6 rounded-2xl',
  '{/* Card 2: Date & Invoice No */}\n            <div className={`glass-card p-6 rounded-2xl ${mobileStep !== 2 ? "hidden md:block" : ""}`}'
);

content = content.replace(
  '{/* Card 3: Billing Sections & Items */}\n            <div className="glass-card p-6 rounded-2xl',
  '{/* Card 3: Billing Sections & Items */}\n            <div className={`glass-card p-6 rounded-2xl ${mobileStep !== 3 ? "hidden md:block" : ""}`}'
);

content = content.replace(
  '{/* Card 4: Discount & Save */}\n            <div className="glass-card p-6 rounded-2xl',
  '{/* Card 4: Discount & Save */}\n            <div className={`glass-card p-6 rounded-2xl ${mobileStep !== 4 ? "hidden md:block" : ""}`}'
);

// 3. Hide Right column on mobile unless step 5
content = content.replace(
  '<div className="xl:col-span-6 space-y-6 sticky top-6">',
  '<div className={`xl:col-span-6 space-y-6 sticky top-6 ${mobileStep !== 5 ? "hidden md:block" : ""}`}>'
);

// 4. Add Mobile Bottom Navigation for Next/Back inside the left column, right at the end of it
const mobileNav = `
            {/* Mobile Step Navigation */}
            <div className="md:hidden fixed bottom-[70px] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 flex justify-between gap-4">
              <button 
                onClick={() => setMobileStep(prev => Math.max(1, prev - 1))}
                disabled={mobileStep === 1}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl disabled:opacity-50"
              >
                Back
              </button>
              {mobileStep < 5 ? (
                <button 
                  onClick={() => setMobileStep(prev => Math.min(5, prev + 1))}
                  className="flex-1 py-3 bg-brand-accent-dark hover:bg-brand-accent text-white font-bold rounded-xl"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={handleSaveInvoice}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex justify-center gap-2"
                >
                  {isSaving ? "Saving..." : "Save Bill"} <Save className="h-4 w-4" />
                </button>
              )}
            </div>
          </div> {/* End Left Column */}
`;

content = content.replace(
  '            </div>\n          </div>\n\n          {/* Right Side: Invoice A4 Preview (6 Columns) */}',
  `            </div>\n${mobileNav}\n\n          {/* Right Side: Invoice A4 Preview (6 Columns) */}`
);

fs.writeFileSync(file, content);
console.log("Modifications complete.");
