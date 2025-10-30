// src/app/page.jsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function HomePage() {
  const token = cookies().get("token")?.value;

  if (token) {
    redirect("/admin");
  } else {
    redirect("/auth/login");
  }
}
