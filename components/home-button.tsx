import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // Import the style helper

export function HomeButton() {
  return (
    <Link 
      href="/" 
      // Apply the ghost variant and icon size classes directly to the Link
      className={buttonVariants({ variant: "ghost", size: "icon" })} 
    >
      <Home className="w-5 h-5" />
      <span className="sr-only">Go home</span>
    </Link>
  );
}