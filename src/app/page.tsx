'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

const Page = () => {
  const [value, setValue] = useState('');

  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success('background gas started');
      },
    }),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181b] via-[#23243a] to-[#ff6f3c] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <Card className="w-full p-0 max-w-2xl max-h-2xl bg-neutral-800 border border-transparent hover:border-neutral-500 rounded-3xl relative transition-all duration-200">
          <CardContent className="p-4 m-2">
            <input
              type="text"
              className="w-full h-full bg-transparent border-none text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 shadow-none outline-none"
              style={{ boxShadow: 'none' }}
              placeholder="Ask Lovable to create a landing page..."
              value={value}
              onChange={e => setValue(e.target.value)}
            />            
            <div className="flex items-center justify-end">
              <Button
                className="w-10 h-10 rounded-full bg-[#666] text-white hover:bg-[#ff6f3c] border-none shadow-none p-0 flex items-center justify-center"
                disabled={invoke.isPending}
                onClick={() => invoke.mutate({ value: value })}
                aria-label="Send"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
