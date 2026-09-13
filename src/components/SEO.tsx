import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  schema?: Record<string, any>;
}

export function SEO({ title, description, url = "https://jjinteriors.site", schema }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", url);

    // Inject JSON-LD Schema
    if (schema) {
      const scriptId = "seo-json-ld";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.innerHTML = JSON.stringify(schema);
    }

    return () => {
      // Cleanup schema on unmount to avoid duplicates across pages
      if (schema) {
        const script = document.getElementById("seo-json-ld");
        if (script) script.remove();
      }
    };
  }, [title, description, url, schema]);

  return null;
}
