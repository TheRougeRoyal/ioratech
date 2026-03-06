'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ApiKeyCreateResponse } from '@/types/api';

export default function CreateApiKeyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [createdKey, setCreatedKey] = useState<any>(null);
  const [name, setName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number | ''>('');
  const [copying, setCopying] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('API key name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/api-keys/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          expires_in_days: expiresInDays ? Number(expiresInDays) : undefined,
        }),
      });

      const data = await response.json() as ApiKeyCreateResponse;

      if (!response.ok) {
        setError(data.error?.message || 'Failed to create API key');
        return;
      }

      if (data.data?.api_key) {
        setCreatedKey(data.data.api_key);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Create API key error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  if (createdKey) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/dashboard/api-keys" className="text-blue-600 hover:underline">
            ← Back to API Keys
          </Link>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">API Key Created Successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-900">
                ⚠️ Save this key somewhere safe. You won't be able to see it again!
              </AlertDescription>
            </Alert>

            <div>
              <Label className="text-sm font-medium text-gray-700">Key Name</Label>
              <p className="text-lg font-medium mt-1">{createdKey.name}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">Your API Key</Label>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm break-all">
                  {createdKey.key}
                </code>
                <Button
                  onClick={() => copyToClipboard(createdKey.key)}
                  className="shrink-0"
                >
                  {copying ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="font-medium">{new Date(createdKey.created_at).toLocaleDateString()}</p>
              </div>
              {createdKey.expires_at && (
                <div>
                  <p className="text-gray-600">Expires</p>
                  <p className="font-medium">{new Date(createdKey.expires_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <Button asChild className="w-full">
              <Link href="/dashboard/api-keys">Go to API Keys</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/dashboard/api-keys" className="text-blue-600 hover:underline">
          ← Back to API Keys
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Create a new API key to access the API</p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production API Key"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                A friendly name to help you identify this key
              </p>
            </div>

            <div>
              <Label htmlFor="expiresInDays">Expires In (Days) - Optional</Label>
              <Input
                id="expiresInDays"
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : '')}
                placeholder="Leave empty for no expiration"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days before this key expires (1-365)
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create API Key'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/api-keys">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
