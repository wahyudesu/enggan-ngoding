'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Page = () => {
  const trpc = useTRPC();
  const [text, setText] = useState('');
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success('background gas started');
      },
    }),
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        disabled={invoke.isPending}
      />
      <Button
        disabled={invoke.isPending || !text.trim()}
        onClick={() => invoke.mutate({ value: text })}
      >
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
