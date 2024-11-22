import AdminAuthModal from "@/components/AdminAuthModal";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  console.log(JSON.stringify(session, null, 2));

  if (!session) {
    return redirect("/auth/signin");
  }

  if (session?.user?.role !== "admin") {
    return <AdminAuthModal open={true} />;
  }

  return <>{children}</>;
}
