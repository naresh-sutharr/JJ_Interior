const fs = require('fs');
const oldCss = fs.readFileSync('Tulsi interior/src/index.css', 'utf8');
const newCssPath = 'src/styles.css';
let newCss = fs.readFileSync(newCssPath, 'utf8');

// Extract the theme variables
const themeVars = `
  --color-brand-beige: var(--brand-beige);
  --color-brand-light: var(--brand-light);
  --color-brand-accent: var(--brand-accent);
  --color-brand-accent-dark: var(--brand-accent-dark);
  --color-brand-red: var(--brand-red);
`;

// Insert into @theme inline
newCss = newCss.replace('@theme inline {', '@theme inline {' + themeVars);

// Extract root variables
const rootVars = `
  --brand-light: #ffffff;
  --brand-beige: #fcfbf9;
  --brand-accent: #c99856;
  --brand-accent-dark: #8b6838;
  --brand-red: #e11d48;
  --border-color: rgba(0, 0, 0, 0.06);
`;
const darkVars = `
  .dark {
    --brand-light: #0a0a0a;
    --brand-beige: #121212;
    --brand-accent: #e5b974;
    --brand-accent-dark: #b8935a;
    --brand-red: #f43f5e;
    --border-color: rgba(255, 255, 255, 0.08);
  }
`;

newCss = newCss.replace(':root {', rootVars + '\n:root {');
newCss = newCss + '\n' + darkVars;

// Extract everything from /* Force dark mode text visibility while protecting print area */ onwards
const customStylesIndex = oldCss.indexOf('/* Force dark mode text visibility while protecting print area */');
if (customStylesIndex !== -1) {
  const customStyles = oldCss.substring(customStylesIndex);
  newCss = newCss + '\n' + customStyles;
}

fs.writeFileSync(newCssPath, newCss);
console.log("Appended legacy CSS to styles.css");
