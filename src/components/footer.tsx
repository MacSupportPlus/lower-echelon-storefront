import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-concrete-700 px-5 pb-10 pt-16 md:px-8">
      <p className="display text-[13vw] leading-[0.82] text-paper/90">
        You are<br />here.
      </p>
      <div className="label mt-14 flex flex-wrap items-center justify-between gap-4 text-concrete-500">
        <span>© {new Date().getFullYear()} Lower Echelon Worldwide · Est. 2020</span>
        <div className="flex gap-6">
          <Link href="/shop" className="hover:text-accent">Shop</Link>
          <a href="https://www.instagram.com/lowerechelonworldwide/" target="_blank" rel="noreferrer" className="hover:text-accent">@lowerechelonworldwide</a>
          <a href="https://www.instagram.com/le.riffjoesph/" target="_blank" rel="noreferrer" className="hover:text-accent">@le.riffjoesph</a>
        </div>
      </div>
    </footer>
  );
}
