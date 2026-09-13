const fs = require('fs');

const file = 'src/routes/admin._panel.clients.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                    {/* Outstanding Due */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-400">Outstanding Due</span>
                      <span className={\`text-sm font-bold flex items-center \${outstanding > 0 ? 'text-brand-red' : 'text-slate-500'}\`}>
                        <IndianRupee className="h-3.5 w-3.5" />
                        {outstanding.toLocaleString('en-IN')}
                      </span>
                    </div>`;

const replacement = `                    {/* Outstanding Due & Mobile Actions */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-400">Outstanding Due</span>
                        <span className={\`text-sm font-bold flex items-center \${outstanding > 0 ? 'text-brand-red' : 'text-slate-500'}\`}>
                          <IndianRupee className="h-3.5 w-3.5" />
                          {outstanding.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      {/* Mobile Quick Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <a 
                          href={\`tel:\${client.phone}\`}
                          className="flex items-center justify-center gap-2 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Call
                        </a>
                        <a 
                          href={\`https://wa.me/91\${client.phone.replace(/\\D/g, '')}\`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 min-h-[44px] bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Replaced successfully");
} else {
  console.log("Target not found!");
}
