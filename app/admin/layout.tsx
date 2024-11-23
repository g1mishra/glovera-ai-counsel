import AdminAuthModal from "@/components/AdminAuthModal";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "admin") {
    return <AdminAuthModal />;
  }

  return <>{children}</>;
}
