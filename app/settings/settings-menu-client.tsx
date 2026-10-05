"use client";

import React from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";

type SettingsMenuClientProps = {
    initialChecked: boolean;
};

export default function SettingsMenuClient({ initialChecked }: SettingsMenuClientProps) {
    const [checked, setChecked] = React.useState(initialChecked);

    return (
        <main className="max-w-md mx-auto p-4 mt-20 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                    Settings
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} id="terms" />
                <Label htmlFor="terms">Accept cookies</Label>
            </div>
        </main>
    );
}