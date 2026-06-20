"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found"
          ? "No account found with this email"
          : "Failed to send reset email. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md border-border/50 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl tracking-tight">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              A password reset link has been sent to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <Button asChild className="w-full h-9 text-sm bg-foreground text-background hover:bg-foreground/90 mt-2">
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-foreground dark:bg-primary">
              <span className="text-xs font-bold text-background dark:text-primary-foreground">I</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Iora</span>
          </Link>
        </div>

        <Card className="border-border/50 bg-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-xs mt-1">Enter your email address to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-9 text-sm"
                />
              </div>

              <Button type="submit" className="w-full h-9 text-sm bg-foreground text-background hover:bg-foreground/90 mt-4" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/30">
              Remember your password?{" "}
              <Link href="/login" className="text-foreground font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
