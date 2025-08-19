import React, { useRef, useState } from "react";
import TikzJax from "react-tikzjax";
import { Download, RefreshCw } from "lucide-react";

const initialTikzCode = `\\draw (0,0) -- (2,2) node[above] {Sample};`;

const TikzInteractive: React.FC = () => {
  const [code, setCode] = useState(initialTikzCode);
  const renderRef = useRef<HTMLDivElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleRefresh = () => {
    setCode((prev) => prev); // trigger re-render
  };

  const handleDownload = () => {
    if (!renderRef.current) return;
    const svg = renderRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tikz-diagram.svg";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full sm:w-[40vw] mx-auto p-6 space-y-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">React TikZ Editor</h2>
        <button
          onClick={handleRefresh}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          title="Re-render"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Render section */}

      <div
        ref={renderRef}
        className="border border-gray-300 rounded-xl p-6 bg-white shadow-inner min-h-[200px] flex items-center justify-center"
      >
        <TikzJax
          content={`\\begin{tikzpicture}${code}\\end{tikzpicture}`}
          onError={(err) => console.error(err)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="p-2 bg-[#e07a5f] text-white rounded-lg transition-colors flex gap-3"
          title="Download SVG"
        >
          Download SVG
          <Download size={20} />
        </button>
      </div>

      {/* Code input */}
      <div className="flex flex-col">
        <label htmlFor="tikz-code" className="mb-2 font-medium text-gray-600">
          Enter TikZ Code:
        </label>
        <textarea
          id="tikz-code"
          value={code}
          onChange={handleChange}
          rows={10}
          className="w-full border border-gray-300 rounded-xl p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
        />
      </div>

      <div className="text-xs text-center text-gray-400">React TikzJax</div>
    </div>
  );
};

export default TikzInteractive;
