// Astro content collection for essays. Each MDX file in src/content/essays/
// has frontmatter that this schema validates. The dynamic [slug].astro route
// reads from this collection first; if the slug isn't here it falls back to
// the legacy.tsx-based AppShell, so essays can be migrated one at a time.

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const essays = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    dek: z.string(),
    minutes: z.number(),
    accent: z.string().default("#1F3DBF"),
    cardBg: z.string().default("#E5E8F0"),
    illustration: z.enum(["hex", "wave", "skate", "protocol"]).default("hex"),
    publishedTime: z.string().optional(), // ISO date for og:article
    draft: z.boolean().default(false),
  }),
});

export const collections = { essays };
