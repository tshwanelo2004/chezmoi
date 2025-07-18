import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storage } from "./storage";
import { insertUserSchema, insertChefSchema, insertServiceSchema, insertBookingSchema, insertReviewSchema, insertMessageSchema, insertNewsletterSchema, insertChefQuizSchema } from "@shared/schema";
import { createPaymentIntent } from "./lib/stripe";
import { setupWebSocket } from "./lib/websocket";
import { getAIHelp, generateContextualHelp } from "./ai-assistant";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email en wachtwoord zijn verplicht." });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Ongeldige inloggegevens." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Ongeldige inloggegevens." });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Authenticatie mislukt." });
        }
        res.json({ 
          success: true, 
          user: { 
            id: user.id, 
            email: user.email, 
            name: `${user.firstName} ${user.lastName}` 
          } 
        });
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Interne serverfout." });
    }
  });

  // Featured chefs endpoint
  app.get("/api/chefs/featured", async (req, res) => {
    try {
      const chefs = await storage.getFeaturedChefs();
      res.json(chefs);
    } catch (error) {
      console.error("Error fetching featured chefs:", error);
      res.status(500).json({ message: "Error fetching chefs" });
    }
  });

  // Create HTTP server
  const server = createServer(app);

  // Setup WebSocket for real-time features
  setupWebSocket(server);

  return server;
}
