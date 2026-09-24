"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // Fixed to the bottom right of the screen
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md px-4 md:px-0">
      <Card className="shadow-2xl border-border bg-card text-card-foreground">
        
        {/* Header with bottom border */}
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Terms & Cookies</CardTitle>
          <CardDescription className="text-base mt-1">
            Review our data usage before continuing.
          </CardDescription>
        </CardHeader>

        {/* Content with specific spacing matching your screenshot */}
        <CardContent className="pt-6 pb-6 space-y-4 text-sm text-muted-foreground">
          <p>
            These terms govern your use of Split Simple, including access to shared group expenses and calculation tools.
          </p>
          <p>
            Because this app does not use accounts, we use a single functional browser cookie to securely remember your recently visited groups on this device.
          </p>
          <p>
            We do not use tracking, analytics, or third-party marketing cookies.
          </p>
        </CardContent>

        {/* Footer with top border and right-aligned buttons */}
        <CardFooter className="flex justify-end gap-3 border-t border-border pt-4 pb-4">
          <Button 
            variant="outline" 
            onClick={declineCookies}
          >
            Decline
          </Button>
          <Button 
            onClick={acceptCookies}
          >
            Accept
          </Button>
        </CardFooter>
        
      </Card>
    </div>
  );
}