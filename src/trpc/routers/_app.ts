import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import {inngest} from '@/inngest/client';

export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: 'test/hello',
        data: {
          value: input.value,
        },
      });
      return { ok: "success" };
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
// export type definition of API
export type AppRouter = typeof appRouter;