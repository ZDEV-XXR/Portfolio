import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyToken } from "@/src/lib/auth";
import LoginForm from "@/src/components/admin/LoginForm";
import AdminConsole from "./AdminConsole";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Console | Hamza Lemghari",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_ACCESS_TOKEN_SECRET;

  const isAuthenticated = await verifyToken(token, secret);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminConsole />;
}
