import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { hmacIp } from "../lib/security.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const analyticsRouter = Router();

const VisitSchema = z.object({
  country: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  userAgent: z.string().max(300).optional().nullable(),
});

analyticsRouter.post("/visit", async (req, res) => {
  const parsed = VisitSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  // Express' req.ip can be impacted by proxies; in production set `app.set("trust proxy", 1)` behind LB/NGINX
  const ip = req.ip || "0.0.0.0";
  const ipHash = hmacIp(ip);

  const visitor = await prisma.visitor.upsert({
    where: { ipHash },
    update: {
      country: parsed.data.country ?? undefined,
      city: parsed.data.city ?? undefined,
      userAgent: parsed.data.userAgent ?? undefined,
      lastSeen: new Date(),
      totalVisits: { increment: 1 },
    },
    create: {
      ipHash,
      country: parsed.data.country ?? null,
      city: parsed.data.city ?? null,
      userAgent: parsed.data.userAgent ?? null,
      firstSeen: new Date(),
      lastSeen: new Date(),
      totalVisits: 1,
    },
  });

  res.json({ visitorId: visitor.id });
});

const LinkSchema = z.object({
  visitorId: z.string().uuid(),
});

analyticsRouter.post("/link", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = LinkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  await prisma.visitorUserLink.upsert({
    where: { visitorId_userId: { visitorId: parsed.data.visitorId, userId: req.user!.id } },
    update: {},
    create: { visitorId: parsed.data.visitorId, userId: req.user!.id },
  });

  res.json({ ok: true });
});
