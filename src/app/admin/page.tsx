import { currentAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/repository";
import { AdminDashboard, AdminLogin } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  try {
    if (await currentAdmin())
      return <AdminDashboard initial={await getCatalog(false)} />;
    return <AdminLogin />;
  } catch {
    return (
      <AdminLogin initialError="Storage is temporarily unavailable. Please try signing in again." />
    );
  }
}
