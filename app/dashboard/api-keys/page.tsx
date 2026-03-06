'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ApiKeyListResponse } from '@/types/api';

interface ApiKey {
  id: string;
  name: string;
  key_preview: string;
  created_at: string;
  last_used_at?: string | null;
  is_active: boolean;
  usage_count: number;
  expires_at?: string | null;
}

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState<string>('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/api-keys/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Failed to load API keys');
        return;
      }

      setApiKeys((data as ApiKeyListResponse).api_keys);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Fetch API keys error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeClick = (keyId: string) => {
    setSelectedKeyId(keyId);
    setRevokeDialogOpen(true);
  };

  const handleRevokeConfirm = async () => {
    if (!selectedKeyId) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/api-keys/revoke', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key_id: selectedKeyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Failed to revoke API key');
        return;
      }

      // Remove the key from the list
      setApiKeys(apiKeys.filter(key => key.id !== selectedKeyId));
      setRevokeDialogOpen(false);
      setSelectedKeyId(null);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Revoke API key error:', err);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  const isExpired = (expiresAt: string | null | undefined) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage your API keys</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/api-keys/create">Create New Key</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Loading API keys...</p>
          </CardContent>
        </Card>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">No API keys yet. Create one to get started.</p>
            <Button asChild>
              <Link href="/dashboard/api-keys/create">Create Your First Key</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex gap-2 items-center">
                      {key.name}
                      {!key.is_active && <Badge variant="secondary">Revoked</Badge>}
                      {isExpired(key.expires_at) && <Badge variant="secondary">Expired</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Created {formatDate(key.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeClick(key.id)}
                    disabled={!key.is_active}
                  >
                    Revoke
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <code className="text-sm font-mono text-gray-700">{key.key_preview}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(key.key_preview, key.id)}
                  >
                    {copiedKeyId === key.id ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Used</p>
                    <p className="font-medium">{formatDate(key.last_used_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Usage Count</p>
                    <p className="font-medium">{key.usage_count}</p>
                  </div>
                  {key.expires_at && (
                    <div>
                      <p className="text-gray-600">Expires</p>
                      <p className="font-medium">{formatDate(key.expires_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevokeConfirm} className="bg-red-600">
            Revoke
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
