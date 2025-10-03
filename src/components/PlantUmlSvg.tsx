// Renders PlantUML by POSTing the source to a Kroki-compatible server.
// Pros: full UML coverage, consistent layout. Cons: network dependency.
// For production, self-host Kroki/PlantUML to avoid privacy/rate limits.
//
// No extra libs required.
// Note: Next.js—put this in a client component (uses fetch at runtime).
"use client";
import React, { useEffect, useState } from "react";

export interface PlantUmlSvgProps {
  source: string;              // PlantUML text: @startuml ... @enduml
  serverUrl?: string;          // defaults to public kroki.io (consider self-hosting)
  ariaLabel?: string;
  className?: string;
}

export const PlantUmlSvg: React.FC<PlantUmlSvgProps> = ({
  source,
  serverUrl = "https://kroki.io/plantuml/svg",
  ariaLabel = "UML diagram",
  className,
}) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: source,
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const svgText = await res.text();
        if (!cancelled) {
          setSvg(svgText);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Render error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, serverUrl]);

  if (loading) return <div aria-busy="true" className={className}>Rendering diagram…</div>;
  if (error) {
    return (
      <div role="alert" className={className}>
        <p>Diagram failed to render.</p>
        <pre aria-label="error details">{error}</pre>
      </div>
    );
  }

  return (
    <>
    <div
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ maxWidth: "100%" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
    <p>Why PlantUML</p>
    <p>Full UML semantics, consistent layouts, and advanced styling/themes.</p>
    <p>The Kroki approach keeps your React app slim and avoids bundling Java or native encoders.</p>
    </>
    
  );
};