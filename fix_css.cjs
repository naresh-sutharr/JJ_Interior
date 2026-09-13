const fs = require('fs');
let css = fs.readFileSync('src/styles.css', 'utf8');

const badVars = `  --brand-light: #ffffff;
  --brand-beige: #fcfbf9;
  --brand-accent: #c99856;
  --brand-accent-dark: #8b6838;
  --brand-red: #e11d48;
  --border-color: rgba(0, 0, 0, 0.06);`;

css = css.replace(badVars + '\n\n:root {', ':root {\n' + badVars);

fs.writeFileSync('src/styles.css', css);
console.log("Fixed CSS syntax error!");
