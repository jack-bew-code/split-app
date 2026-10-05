import Link from "next/link";
import { Settings } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; 

export function SettingsButton() {
  return (
    <Link 
      href="/settings" 
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <Settings className="w-5 h-5" />
      <span className="sr-only">Go to setings</span>
    </Link>
  );
}