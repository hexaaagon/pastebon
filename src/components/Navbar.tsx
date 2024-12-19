"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex h-12 w-screen items-center justify-between border-b p-8 px-6 transition-[padding] sm:px-8 md:px-12">
      <span>
        <Image
          src="/static/images/logo-text-light.png"
          alt="Pastebon Logo"
          width={120}
          height={30}
          priority
          className="hidden h-auto w-auto dark:block"
        />
        <Image
          src="/static/images/logo-text-dark.png"
          alt="Pastebon Logo"
          width={120}
          height={30}
          priority
          className="block h-auto w-auto dark:hidden"
        />
      </span>
      <div className="flex items-center gap-1"></div>
    </nav>
  );
}
