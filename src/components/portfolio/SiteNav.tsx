'use client'

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./content";
import { container, primaryButton } from "./styles";

export const SiteNav = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const links = navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      className={`no-underline hover:text-white ${isActive(item.href) ? "text-white" : "text-pf-soft"}`}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className="border-b border-pf-line">
      <nav className={`${container} flex items-center justify-between gap-4 py-5`}>
        <Link href="/" className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-pf-text no-underline hover:text-white">
          angel<span className="text-pf-accent">.</span>mateus
        </Link>

        <div className="hidden items-center gap-7 text-[15px] lg:flex">
          {links}
          <Link href="/contact" className={`${primaryButton} rounded-[10px] px-[18px] py-[11px]`}>
            Book a call
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary
            aria-label="Menu"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center rounded-[10px] border border-pf-strong text-pf-soft [&::-webkit-details-marker]:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </summary>
          <div className="absolute right-0 z-50 mt-2 flex w-[220px] flex-col gap-1 rounded-2xl border border-pf-border bg-pf-surface p-3 text-base [&>a]:flex [&>a]:min-h-[44px] [&>a]:items-center [&>a]:px-2">
            {links}
            <Link href="/contact" className={`${primaryButton} mt-2 rounded-[10px] px-[18px]`}>
              Book a call
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
};
