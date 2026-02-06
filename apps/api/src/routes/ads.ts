import { Router } from "express";
import { prisma } from "../prisma.js";

export const adsRouter = Router();

adsRouter.get("/", async (_req, res) => {
  const ads = await prisma.advertisingSpace.findMany({ orderBy: { slot: "asc" } });
  res.json(ads);
});
