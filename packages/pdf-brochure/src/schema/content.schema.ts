import { z } from "zod";

const documentMetadataSchema = z.object({
  companyName: z.string().min(1),
  address: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  website: z.string().min(1),
  instagram: z.string().min(1),
  logoUrl: z.string().min(1).optional(),
});

const textBlockSchema = z.object({
  type: z.literal("text"),
  heading: z.string().min(1).optional(),
  body: z.string().min(1),
});

const textImageBlockSchema = z.object({
  type: z.literal("textImage"),
  heading: z.string().min(1).optional(),
  body: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().min(1),
  imagePosition: z.enum(["left", "right"]).default("right"),
});

const pricingTierSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  highlighted: z.boolean().optional(),
});

const pricingTableBlockSchema = z.object({
  type: z.literal("pricingTable"),
  heading: z.string().min(1).optional(),
  tiers: z.array(pricingTierSchema).min(1),
});

const galleryImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const galleryBlockSchema = z.object({
  type: z.literal("gallery"),
  heading: z.string().min(1).optional(),
  images: z.array(galleryImageSchema).min(1).max(6),
});

const testimonialBlockSchema = z.object({
  type: z.literal("testimonial"),
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1).optional(),
});

const benefitsListBlockSchema = z.object({
  type: z.literal("benefitsList"),
  heading: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).min(1),
});

const blockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  textImageBlockSchema,
  pricingTableBlockSchema,
  galleryBlockSchema,
  testimonialBlockSchema,
  benefitsListBlockSchema,
]);

export const brochureContentSchema = documentMetadataSchema.extend({
  blocks: z.array(blockSchema),
});

export type BrochureContent = z.infer<typeof brochureContentSchema>;
export type Block = z.infer<typeof blockSchema>;

export type ValidateContentResult =
  | { success: true; data: BrochureContent }
  | { success: false; errors: string[] };

export function validateContent(data: unknown): ValidateContentResult {
  const result = brochureContentSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  return { success: false, errors };
}
