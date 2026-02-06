import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["admin"]));

adminRouter.get("/stats", async (_req, res) => {
  const [creatorCount, userCount] = await Promise.all([
    prisma.user.count({ where: { role: "provider" } }),
    prisma.user.count({ where: { role: "customer" } }),
  ]);
  res.json({ creatorCount, userCount });
});

adminRouter.get("/ads", async (_req, res) => {
  const ads = await prisma.advertisingSpace.findMany({ orderBy: { slot: "asc" } });
  res.json(ads);
});

const AdSchema = z.object({
  slot: z.string().min(1),
  title: z.string().min(1).max(120),
  subtitle: z.string().min(1).max(180),
  image: z.string().min(1),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
});

const AdsSchema = z.array(AdSchema).length(3);

adminRouter.put("/ads", async (req, res) => {
  const parsed = AdsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const ads = await Promise.all(
    parsed.data.map((item) =>
      prisma.advertisingSpace.upsert({
        where: { slot: item.slot },
        update: {
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          ctaLabel: item.ctaLabel?.trim() || null,
          ctaHref: item.ctaHref?.trim() || null,
        },
        create: {
          slot: item.slot,
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          ctaLabel: item.ctaLabel?.trim() || null,
          ctaHref: item.ctaHref?.trim() || null,
        },
      })
    )
  );

  res.json(ads);
});
