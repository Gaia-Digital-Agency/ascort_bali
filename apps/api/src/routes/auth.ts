import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { signAccessToken, signRefreshToken, verifyJwt } from "../lib/jwt.js";
import { sha256 } from "../lib/security.js";
import { env } from "../lib/env.js";

export const authRouter = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["customer", "provider"]),
});

authRouter.post("/register", rateLimit, async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const { email, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "email_in_use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role } });

  // create empty profiles
  if (role === "customer") await prisma.userProfile.create({ data: { userId: user.id } });
  if (role === "provider") await prisma.providerProfile.create({ data: { userId: user.id, displayName: email.split("@")[0] } });

  const accessToken = await signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = await signRefreshToken({ sub: user.id, role: user.role, email: user.email });

  const tokenHash = sha256(refreshToken);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000) },
  });

  res.json({ accessToken, refreshToken });
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", rateLimit, async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  const accessToken = await signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = await signRefreshToken({ sub: user.id, role: user.role, email: user.email });
  const tokenHash = sha256(refreshToken);

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000) },
  });

  res.json({ accessToken, refreshToken });
});

const RefreshSchema = z.object({ refreshToken: z.string().min(10) });

authRouter.post("/refresh", rateLimit, async (req, res) => {
  const parsed = RefreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const { refreshToken } = parsed.data;

  // Verify JWT and then verify stored token hash not revoked & not expired
  let payload: { sub: string; role: string; email: string };
  try {
    const verified = await verifyJwt(refreshToken);
    payload = { sub: verified.sub, role: verified.role, email: verified.email };
  } catch {
    return res.status(401).json({ error: "invalid_refresh" });
  }

  const tokenHash = sha256(refreshToken);
  const rt = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!rt || rt.revoked) return res.status(401).json({ error: "refresh_revoked" });
  if (rt.expiresAt.getTime() < Date.now()) return res.status(401).json({ error: "refresh_expired" });

  // Rotate refresh token: revoke old, create new
  await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });

  const newAccess = await signAccessToken(payload);
  const newRefresh = await signRefreshToken(payload);
  await prisma.refreshToken.create({
    data: { userId: payload.sub, tokenHash: sha256(newRefresh), expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000) },
  });

  res.json({ accessToken: newAccess, refreshToken: newRefresh });
});

const LogoutSchema = z.object({ refreshToken: z.string().min(10) });

authRouter.post("/logout", async (req, res) => {
  const parsed = LogoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const { refreshToken } = parsed.data;
  const tokenHash = sha256(refreshToken);
  const rt = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (rt) await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
  res.json({ ok: true });
});
