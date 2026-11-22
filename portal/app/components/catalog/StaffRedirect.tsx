"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isStaff, roleHome, useRole } from "@/app/lib/session";

/** Sends Morgan staff from the customer home page to their own workspace. */
export function StaffRedirect() {
  const role = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isStaff(role)) router.replace(roleHome(role));
  }, [role, router]);

  return null;
}
