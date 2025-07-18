import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import "./auth/passport"; // Initialize passport configuration

const app = express();

// Database connection pool for sessions
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const PgSession = ConnectPgSimple(session);

// Session middleware with PostgreSQL store
app.use(session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Passport middleware
import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());

// Middleware: JSON en URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware: Logging
app.use(apiLoggerMiddleware);

// Initialize database
import { seedDatabase } from "./seed";

// Middleware: Routes
(async () => {
  // Seed database on startup
  await seedDatabase();
  
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use(errorHandler);

  // Vite of statische bestanden
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Server start
  const port = parseInt(process.env.PORT || "5000");
  server.listen(port, "0.0.0.0", () => {
    log(`Serving on port ${port}`);
  });
})();

// --- Logging Middleware ---
function apiLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.path;
  let responseBody: any;

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.once("finish", () => {
    if (!path.startsWith("/api")) return;

    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

    if (responseBody) {
      try {
        logLine += ` :: ${JSON.stringify(responseBody)}`;
      } catch {
        logLine += ` :: [unserializable response body]`;
      }
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 77) + "…";
    }

    log(logLine);
  });

  next();
}

// --- Error Handling Middleware ---
function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const isDev = process.env.NODE_ENV === "development";

  res.status(status).json({
    message,
    ...(isDev && { stack: err.stack }),
  });

  // Optioneel opnieuw gooien in dev voor beter debugging
  if (isDev) {
    console.error(err);
  }
}
