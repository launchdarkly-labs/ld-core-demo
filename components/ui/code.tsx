import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { useEffect } from "react";

export default function Code({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  useEffect(() => {
    console.log("Prism", Prism);
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
