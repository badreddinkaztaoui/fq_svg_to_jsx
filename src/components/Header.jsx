import { SvgComponent } from "@/test/Vercel";

export default function Header() {
    return (
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto">
          <div className="w-8 h-8">
            <SvgComponent />
          </div>
          <h1 className="text-2xl font-bold text-indigo-400">SVG to JSX/TSX Converter</h1>
          <p className="text-gray-400">Convert your SVG icons to React components with ease</p>
        </div>
      </header>
    );
  }