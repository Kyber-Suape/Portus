"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_ITEMS } from "@/constants/nav";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-lg backdrop-blur-xl lg:hidden">
      {MOBILE_NAV_ITEMS.map((item, index) => {
        const isActive = pathname === item.href;
        const isCentral = index === 2;
        const Icon = item.icon;

        if (!item.implemented) {
          return (
            <span
              key={item.label}
              title="Disponível em uma próxima etapa"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl p-1.5 text-[11px] font-medium text-muted-foreground/50",
                isCentral && "-mt-6",
              )}
            >
              {isCentral ? (
                <span className="flex size-12 items-center justify-center rounded-full bg-primary-900/40 text-white shadow-md">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
              ) : (
                <Icon className="size-5" aria-hidden="true" />
              )}
              {item.label}
            </span>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-xl p-1.5 text-[11px] font-medium transition-colors",
              isCentral && "-mt-6",
              isActive && !isCentral ? "text-primary-900" : "text-muted-foreground",
            )}
          >
            {isCentral ? (
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-900 text-white shadow-md">
                <Icon className="size-6" aria-hidden="true" />
              </span>
            ) : (
              <Icon className="size-5" aria-hidden="true" />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
