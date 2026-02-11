import { AppShell } from "@/app/u/_components/app-shell";

export default function ULayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
