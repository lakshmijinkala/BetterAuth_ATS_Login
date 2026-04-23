import "dotenv/config";

process.on('unhandledRejection', (reason) => {
  console.error('MESSAGE:', reason?.message);
  console.error('CAUSE:', reason?.cause?.message || reason?.cause);
  console.error('ROOT:', reason?.cause?.cause?.message || reason?.cause?.cause);
  console.error('STACK:', reason?.stack);
});

import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";



const app = express();

// Better Auth handles EVERYTHING under /api/auth/* automatically.
// This MUST come before express.json() so Better Auth can parse its own request bodies.
app.all("/api/auth/*splat", toNodeHandler(auth));

// This lets Express read JSON from your other routes (if you add any later)
app.use(express.json());

// Serve your HTML/CSS files from the current folder
app.use(express.static("."));

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
