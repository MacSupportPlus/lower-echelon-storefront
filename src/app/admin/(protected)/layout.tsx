import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="flex items-center justify-between border-b border-concrete-700 px-5 py-4 md:px-8">
        <nav className="label flex items-center gap-6">
          <Link href="/admin" className="display text-xl">Admin</Link>
          <Link href="/admin/products" className="hover:text-accent">Products</Link>
        </nav>
        <div className="label flex items-center gap-4 text-concrete-500">
          <span>{session.email}</span>
          <form action={logout}>
            <button type="submit" className="hover:text-accent">Sign out</button>
          </form>
        </div>
      </header>
      <div className="px-5 py-8 md:px-8">{children}</div>
    </div>
  );
}
