import express from "express";
import { z } from "zod";
import { createChallenge, verifyWallet } from "./services/wallet-store.js";
import { preparePayment } from "./services/payment-prep.js";

const challengeSchema = z.object({
  publicKey: z.string().min(10)
});

const verifySchema = z.object({
  publicKey: z.string().min(10),
  signature: z.string().min(10)
});

const paymentSchema = z.object({
  amount: z.string().min(1),
  asset: z.enum(["XLM", "USDC"]),
  destination: z.string().min(10)
});

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.post("/wallets/challenge", (req, res) => {
    const parsed = challengeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Invalid wallet challenge request", details: parsed.error.flatten() });
      return;
    }

    res.status(200).json({
      publicKey: parsed.data.publicKey,
      challenge: createChallenge(parsed.data.publicKey)
    });
  });

  app.post("/wallets/verify", (req, res) => {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Invalid wallet verification request", details: parsed.error.flatten() });
      return;
    }

    const wallet = verifyWallet(parsed.data.publicKey, parsed.data.signature);

    if (!wallet) {
      res.status(401).json({ error: "Wallet verification failed" });
      return;
    }

    res.status(200).json(wallet);
  });

  app.post("/payments/prepare", (req, res) => {
    const parsed = paymentSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Valid payment preparation request", details: parsed.error.flatten() });
      return;
    }

    res.status(200).json(preparePayment(parsed.data));
  });

  return app;
}
