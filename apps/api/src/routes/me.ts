import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, role: true, email: true, phone: true, phoneVerified: true, createdAt: true, lastLogin: true },
  });
  res.json(user);
});

const UserProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional().nullable(),
  gender: z.string().max(40).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().max(80).optional().nullable(),
  primaryCountry: z.string().max(80).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

meRouter.put("/profile", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = UserProfileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const dob = parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null;
  await prisma.userProfile.upsert({
    where: { userId: req.user!.id },
    update: { ...parsed.data, dateOfBirth: dob },
    create: { userId: req.user!.id, ...parsed.data, dateOfBirth: dob },
  });

  res.json({ ok: true });
});

const ProviderProfileSchema = z.object({
  displayName: z.string().min(2).max(80),
  bio: z.string().max(2000).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  telegramId: z.string().max(80).optional().nullable(),
  languageIds: z.array(z.number().int()).optional().default([]),
});

meRouter.get("/provider", requireAuth, requireRole(["provider","admin"]), async (req: AuthedRequest, res) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId: req.user!.id },
    include: { languages: { include: { language: true } } },
  });
  res.json(profile);
});

meRouter.put("/provider", requireAuth, requireRole(["provider","admin"]), async (req: AuthedRequest, res) => {
  const parsed = ProviderProfileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const { languageIds, ...rest } = parsed.data;

  await prisma.providerProfile.upsert({
    where: { userId: req.user!.id },
    update: rest,
    create: { userId: req.user!.id, ...rest },
  });

  // Replace languages
  await prisma.providerLanguage.deleteMany({ where: { providerId: req.user!.id } });
  if (languageIds.length) {
    await prisma.providerLanguage.createMany({
      data: languageIds.map((languageId) => ({ providerId: req.user!.id, languageId })),
      skipDuplicates: true,
    });
  }

  res.json({ ok: true });
});

meRouter.get("/favorites", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.favorite.findMany({
    where: { userId: req.user!.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

meRouter.post("/favorites/:serviceId", requireAuth, async (req: AuthedRequest, res) => {
  const serviceId = req.params.serviceId;
  await prisma.favorite.upsert({
    where: { userId_serviceId: { userId: req.user!.id, serviceId } },
    update: {},
    create: { userId: req.user!.id, serviceId },
  });
  res.json({ ok: true });
});

meRouter.delete("/favorites/:serviceId", requireAuth, async (req: AuthedRequest, res) => {
  const serviceId = req.params.serviceId;
  await prisma.favorite.deleteMany({ where: { userId: req.user!.id, serviceId } });
  res.json({ ok: true });
});

meRouter.get("/orders", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { service: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});
