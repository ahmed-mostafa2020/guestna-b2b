"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

// Sanitizes backend-supplied HTML before rendering. Strips script/style/iframe
// tags and all inline event handlers — defense in depth alongside the nonce
// CSP. Renders empty on the server then replaces on mount to avoid hydration
// mismatches (DOMPurify only runs in a browser context).
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onmouseout",
    "onfocus",
    "onblur",
    "onsubmit",
    "onchange",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "formaction",
  ],
};

const SafeHtml = ({ html, className, as: Tag = "div", ...rest }) => {
  const [clean, setClean] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !html) {
      setClean("");
      return;
    }
    setClean(DOMPurify.sanitize(html, PURIFY_CONFIG));
  }, [html]);

  return (
    <Tag
      {...rest}
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default SafeHtml;
