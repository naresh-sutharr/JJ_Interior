

/**
 * Convert OKLCH color string (e.g., "oklch(0.627 0.265 303.9 / 0.5)") to safe RGB/RGBA format
 * so html2canvas can parse styles without throwing unsupported color function errors.
 */
const oklchToRgb = (oklchStr) => {
  try {
    const innerMatch = oklchStr.match(/oklch\(([^)]+)\)/i);
    if (!innerMatch) return 'rgb(51, 65, 85)';

    const inner = innerMatch[1].trim();
    let mainParts = inner;
    let alphaVal = 1;

    if (inner.includes('/')) {
      const splitSlash = inner.split('/');
      mainParts = splitSlash[0].trim();
      const aRaw = splitSlash[1].trim();
      alphaVal = aRaw.endsWith('%') ? parseFloat(aRaw) / 100 : parseFloat(aRaw);
    }

    const parts = mainParts.split(/[\s,]+/).filter(Boolean);
    if (parts.length < 3) return 'rgb(51, 65, 85)';

    let L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
    let C = parts[1].endsWith('%') ? (parseFloat(parts[1]) / 100) * 0.4 : parseFloat(parts[1]);
    
    let hRaw = parts[2];
    let H = parseFloat(hRaw);
    if (hRaw.endsWith('rad')) H = H * (180 / Math.PI);
    else if (hRaw.endsWith('grad')) H = H * 0.9;
    else if (hRaw.endsWith('turn')) H = H * 360;

    if (parts.length >= 4 && alphaVal === 1) {
      const aRaw = parts[3];
      alphaVal = aRaw.endsWith('%') ? parseFloat(aRaw) / 100 : parseFloat(aRaw);
    }

    if (isNaN(L) || isNaN(C) || isNaN(H)) return 'rgb(51, 65, 85)';

    // OKLCH -> OKLAB
    const hRad = (H * Math.PI) / 180;
    const labA = C * Math.cos(hRad);
    const labB = C * Math.sin(hRad);

    // OKLAB -> linear LMS
    const l_ = L + 0.3963377774 * labA + 0.2158037573 * labB;
    const m_ = L - 0.1055613458 * labA - 0.0638541728 * labB;
    const s_ = L - 0.0894841775 * labA - 1.2914855480 * labB;

    const lComp = l_ * l_ * l_;
    const mComp = m_ * m_ * m_;
    const sComp = s_ * s_ * s_;

    // linear LMS -> linear sRGB
    const rLin = +4.0767416621 * lComp - 3.3077115913 * mComp + 0.2309699292 * sComp;
    const gLin = -1.2684380046 * lComp + 2.6097574011 * mComp - 0.3413193965 * sComp;
    const bLin = +0.0041960863 * lComp - 0.7034186147 * mComp + 1.7076147010 * sComp;

    // Linear sRGB to gamma-corrected sRGB
    const gammaCorrect = (val) => {
      if (val <= 0.0031308) return 12.92 * val;
      return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
    };

    let r = Math.min(255, Math.max(0, Math.round(gammaCorrect(rLin) * 255)));
    let g = Math.min(255, Math.max(0, Math.round(gammaCorrect(gLin) * 255)));
    let b = Math.min(255, Math.max(0, Math.round(gammaCorrect(bLin) * 255)));

    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'rgb(51, 65, 85)';

    if (alphaVal < 1 && !isNaN(alphaVal)) {
      return `rgba(${r}, ${g}, ${b}, ${alphaVal})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  } catch (err) {
    return 'rgb(51, 65, 85)';
  }
};

/**
 * Convert OKLAB color string (e.g., "oklab(0.5 0.1 -0.2)") to safe RGB/RGBA format
 */
const oklabToRgb = (oklabStr) => {
  try {
    const innerMatch = oklabStr.match(/oklab\(([^)]+)\)/i);
    if (!innerMatch) return 'rgb(51, 65, 85)';

    const inner = innerMatch[1].trim();
    let mainParts = inner;
    let alphaVal = 1;

    if (inner.includes('/')) {
      const splitSlash = inner.split('/');
      mainParts = splitSlash[0].trim();
      const aRaw = splitSlash[1].trim();
      alphaVal = aRaw.endsWith('%') ? parseFloat(aRaw) / 100 : parseFloat(aRaw);
    }

    const parts = mainParts.split(/[\s,]+/).filter(Boolean);
    if (parts.length < 3) return 'rgb(51, 65, 85)';

    let L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
    let labA = parts[1].endsWith('%') ? (parseFloat(parts[1]) / 100) * 0.4 : parseFloat(parts[1]);
    let labB = parts[2].endsWith('%') ? (parseFloat(parts[2]) / 100) * 0.4 : parseFloat(parts[2]);

    if (parts.length >= 4 && alphaVal === 1) {
      const aRaw = parts[3];
      alphaVal = aRaw.endsWith('%') ? parseFloat(aRaw) / 100 : parseFloat(aRaw);
    }

    if (isNaN(L) || isNaN(labA) || isNaN(labB)) return 'rgb(51, 65, 85)';

    // OKLAB -> linear LMS
    const l_ = L + 0.3963377774 * labA + 0.2158037573 * labB;
    const m_ = L - 0.1055613458 * labA - 0.0638541728 * labB;
    const s_ = L - 0.0894841775 * labA - 1.2914855480 * labB;

    const lComp = l_ * l_ * l_;
    const mComp = m_ * m_ * m_;
    const sComp = s_ * s_ * s_;

    // linear LMS -> linear sRGB
    const rLin = +4.0767416621 * lComp - 3.3077115913 * mComp + 0.2309699292 * sComp;
    const gLin = -1.2684380046 * lComp + 2.6097574011 * mComp - 0.3413193965 * sComp;
    const bLin = +0.0041960863 * lComp - 0.7034186147 * mComp + 1.7076147010 * sComp;

    // Linear sRGB to gamma-corrected sRGB
    const gammaCorrect = (val) => {
      if (val <= 0.0031308) return 12.92 * val;
      return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
    };

    let r = Math.min(255, Math.max(0, Math.round(gammaCorrect(rLin) * 255)));
    let g = Math.min(255, Math.max(0, Math.round(gammaCorrect(gLin) * 255)));
    let b = Math.min(255, Math.max(0, Math.round(gammaCorrect(bLin) * 255)));

    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'rgb(51, 65, 85)';

    if (alphaVal < 1 && !isNaN(alphaVal)) {
      return `rgba(${r}, ${g}, ${b}, ${alphaVal})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  } catch (err) {
    return 'rgb(51, 65, 85)';
  }
};

/**
 * Universal CSS color string cleaner to strip all modern unsupported CSS color functions
 */
const replaceUnsupportedColors = (cssText) => {
  if (!cssText) return cssText;
  let clean = cssText;
  if (clean.includes('oklch')) {
    clean = clean.replace(/oklch\([^)]+\)/gi, (m) => oklchToRgb(m));
  }
  if (clean.includes('oklab')) {
    clean = clean.replace(/oklab\([^)]+\)/gi, (m) => oklabToRgb(m));
  }
  if (clean.includes('color-mix')) {
    clean = clean.replace(/color-mix\([^)]+\)/gi, 'rgb(51, 65, 85)');
  }
  if (clean.includes('color(')) {
    clean = clean.replace(/color\([^)]+\)/gi, 'rgb(51, 65, 85)');
  }
  if (clean.includes('lab(')) {
    clean = clean.replace(/lab\([^)]+\)/gi, 'rgb(51, 65, 85)');
  }
  if (clean.includes('lch(')) {
    clean = clean.replace(/lch\([^)]+\)/gi, 'rgb(51, 65, 85)');
  }
  return clean;
};

/**
 * Helper to replace oklch/oklab color functions in CSS text with safe RGB/Hex values
 * and guarantee captured element opacity/visibility in the cloned DOM tree at (0,0).
 */
const sanitizeCssColorsInDoc = (clonedDoc, elementId) => {
  try {
    // 1. Ensure target element & parent chain are positioned cleanly at (0,0) in clonedDoc
    if (elementId) {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.position = 'static';
        clonedElement.style.left = '0px';
        clonedElement.style.top = '0px';
        clonedElement.style.opacity = '1';
        clonedElement.style.visibility = 'visible';
        clonedElement.style.display = 'block';

        let curr = clonedElement.parentElement;
        while (curr && curr !== clonedDoc.body) {
          curr.style.position = 'static';
          curr.style.left = '0px';
          curr.style.top = '0px';
          curr.style.opacity = '1';
          curr.style.visibility = 'visible';
          curr.style.display = 'block';
          curr = curr.parentElement;
        }
      }
    }

    // 2. Sanitize all <style> elements in clonedDoc
    const styleTags = clonedDoc.getElementsByTagName('style');
    for (let i = 0; i < styleTags.length; i++) {
      const styleEl = styleTags[i];
      if (styleEl.textContent) {
        styleEl.textContent = replaceUnsupportedColors(styleEl.textContent);
      }
    }

    // 3. Sanitize parsed CSSStyleSheets in clonedDoc
    try {
      const sheets = Array.from(clonedDoc.styleSheets || []);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          for (let r = rules.length - 1; r >= 0; r--) {
            const rule = rules[r];
            if (rule && rule.cssText) {
              const hasUnsupported = /oklch|oklab|color-mix|color\(|lab\(|lch\(/i.test(rule.cssText);
              if (hasUnsupported) {
                const updatedCss = replaceUnsupportedColors(rule.cssText);
                try {
                  sheet.deleteRule(r);
                  sheet.insertRule(updatedCss, r);
                } catch (e) {
                  try { sheet.deleteRule(r); } catch (delErr) {}
                }
              }
            }
          }
        } catch (sheetErr) {
          // Ignore cross-origin stylesheet access restrictions
        }
      }
    } catch (err) {
      console.warn("StyleSheet iteration warning:", err);
    }

    // 4. Sanitize inline styles on elements
    const allEls = clonedDoc.querySelectorAll('*');
    allEls.forEach(el => {
      if (el.style) {
        const styleAttr = el.getAttribute('style');
        if (styleAttr) {
          const newStyle = replaceUnsupportedColors(styleAttr);
          el.setAttribute('style', newStyle);
        }
      }
    });
  } catch (e) {
    console.warn("CSS sanitization warning:", e);
  }
};

/**
 * High resolution vector/image PDF generator utility for Tulsi Interior invoices.
 * Ensures compatibility across Vite bundling, default exports, and offscreen rendering.
 */
export const downloadPDF = async (elementId, filename = 'invoice.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`PDF capture element '${elementId}' not found.`);
      alert("Error: Billing capture container not found.");
      return false;
    }

    // Handle Vite / ES module default export wrappers safely
    let html2pdf;
    try {
      const module = await import('html2pdf.js');
      html2pdf = module.default || module;
    } catch (err) {
      console.error("Failed to load html2pdf.js", err);
      return false;
    }
    const pdfGenerator = typeof html2pdf === 'function' ? html2pdf : (html2pdf?.default || window?.html2pdf);

    if (typeof pdfGenerator !== 'function') {
      console.error("html2pdf library is not executable:", html2pdf);
      alert("Error: PDF generator library failed to initialize properly.");
      return false;
    }

    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        onclone: (clonedDoc) => {
          // Make the capture element fully visible in the clone so html2canvas renders it correctly
          const captureEl = clonedDoc.getElementById(elementId);
          if (captureEl) {
            // Reset parent wrapper visibility
            const parent = captureEl.parentElement;
            if (parent) {
              parent.style.position = 'absolute';
              parent.style.top = '0';
              parent.style.left = '0';
              parent.style.visibility = 'visible';
              parent.style.opacity = '1';
              parent.style.zIndex = '1';
              parent.style.transform = 'none';
              parent.style.backgroundColor = '#ffffff';
            }
            // Remove gap-4 class from the container to prevent double page breaks
            captureEl.classList.remove('gap-4');
            captureEl.classList.add('gap-0');
            // Reset element itself
            captureEl.style.visibility = 'visible';
            captureEl.style.opacity = '1';
            captureEl.style.transform = 'none';
            captureEl.style.position = 'relative';
            captureEl.style.top = '0';
            captureEl.style.left = '0';
          }
          sanitizeCssColorsInDoc(clonedDoc, elementId);
        }
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    await pdfGenerator().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error("PDF generation error:", error);
    alert(`PDF generation failed: ${error.message || error}`);
    return false;
  }
};
