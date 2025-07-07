import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messagesRouter } from '@/modules/messages/server/procedures';

export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.any(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log('tRPC invoke called with input:', input);
      await inngest.send({
        name: 'test/hello.world',
        data: {
          value: input.value,
        },
      });

      return { ok: 'success' };
    }),
  createAI: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // Implement your createAI logic here
      return { message: `AI created with text: ${input.text}` };
    }),
});

export type AppRouter = typeof appRouter;

export const mainRouter = createTRPCRouter({
  messages: messagesRouter,
  app: appRouter,
});

export type MainRouter = typeof mainRouter;
