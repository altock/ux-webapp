import { z } from 'zod/v4';

export const TargetSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('html'),
    html: z.string().min(1),
    baseUrl: z.string().url().optional()
  }),
  z.object({
    type: z.literal('url'),
    url: z.string().url()
  }),
  z.object({
    type: z.literal('file'),
    path: z.string().min(1)
  })
]);

export const SourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('html') }),
  z.object({ type: z.literal('url'), url: z.string().url() }),
  z.object({ type: z.literal('file'), path: z.string().min(1) }),
  z.object({ type: z.literal('text') })
]);

export const CommonOptionsSchema = z
  .object({
    maxBytes: z.number().int().min(10_000).max(20_000_000).optional(),
    timeoutMs: z.number().int().min(100).max(60_000).optional()
  })
  .optional();
