"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui/primitives";
import { Alert, AlertDescription } from "@/components/ui/secondary-primitives"; // Ensure this matches import
import { auth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Save API key first if provided (optional but recommended here)
    if (apiKey) {
      storage.saveApiKey(apiKey);
    }

    const isValid = await auth.login(password);
    if (isValid) {
      router.push("/");
    } else {
      setError("Access Denied. Invalid Passphrase.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-center font-mono tracking-widest text-primary">
            DEGEN ANALYST TERMINAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Passphrase</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter secure passphrase..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
              />
            </div>



            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" variant="default">
              INITIALIZE SESSION
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
