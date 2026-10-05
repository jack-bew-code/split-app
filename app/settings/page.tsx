import { cookies } from "next/headers";
import SettingsMenuClient from "./settings-menu-client";

export default async function SettingsMenu() {
  const cookieStore = await cookies();
  const cookieConsent = cookieStore.get("cookie_consent")?.value === "true";

  return <SettingsMenuClient initialChecked={cookieConsent} />;
}