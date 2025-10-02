"use client";
import React, { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

export interface MermaidChartProps {
  code: string;                 // Mermaid DSL
  className?: string;
  ariaLabel?: string;           // a11y label for the SVG
}

const MermaidChart: React.FC<MermaidChartProps> = ({
  code,
  className,
  ariaLabel = "UML diagram",
}) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const renderId = useId(); // stable unique id per mount

  useEffect(() => {
    let cancelled = false;

    // Initialize once per mount; safe to call repeatedly.
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",  // sanitize SVG
      theme: "default",
    });

    (async () => {
      try {
        const { svg } = await mermaid.render(`mmd-${renderId}`, code);
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Render error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (error) {
    return (
      <div role="alert" className={className}>
        <p>Diagram failed to render.</p>
        <pre aria-label="error details">{error}</pre>
      </div>
    );
  }

  // svg is trusted through Mermaid's sanitizer; still render via dangerouslySetInnerHTML.
  return (
    <div
      className={className}
      role="img"
      aria-label={ariaLabel}
      // Ensure responsiveness: SVGs from Mermaid are width/height set; container can scale.
      style={{ maxWidth: "100%" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export { MermaidChart }