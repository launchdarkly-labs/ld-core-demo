import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-csharp";
import { useEffect } from "react";

export default function Code({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div className="my-3.5">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
