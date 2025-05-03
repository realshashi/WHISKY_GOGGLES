import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScanSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get all bottles
  apiRouter.get("/bottles", async (req: Request, res: Response) => {
    try {
      const bottles = await storage.getBottles();
      res.json(bottles);
    } catch (error) {
      console.error('Error fetching bottles:', error);
      res.status(500).json({ message: 'Failed to fetch bottles' });
    }
  });

  // Get a specific bottle by ID
  apiRouter.get("/bottles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid bottle ID' });
      }
      
      const bottle = await storage.getBottleById(id);
      if (!bottle) {
        return res.status(404).json({ message: 'Bottle not found' });
      }
      
      res.json(bottle);
    } catch (error) {
      console.error('Error fetching bottle:', error);
      res.status(500).json({ message: 'Failed to fetch bottle' });
    }
  });

  // Search bottles
  apiRouter.get("/bottles/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const bottles = await storage.searchBottles(query);
      res.json(bottles);
    } catch (error) {
      console.error('Error searching bottles:', error);
      res.status(500).json({ message: 'Failed to search bottles' });
    }
  });

  // Create a new scan record
  apiRouter.post("/scans", async (req: Request, res: Response) => {
    try {
      const parseResult = insertScanSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const scan = await storage.createScan(parseResult.data);
      res.status(201).json(scan);
    } catch (error) {
      console.error('Error creating scan:', error);
      res.status(500).json({ message: 'Failed to create scan' });
    }
  });

  // Get all scans
  apiRouter.get("/scans", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;
      const scans = await storage.getScans(userId);
      res.json(scans);
    } catch (error) {
      console.error('Error fetching scans:', error);
      res.status(500).json({ message: 'Failed to fetch scans' });
    }
  });

  // Get a specific scan
  apiRouter.get("/scans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid scan ID' });
      }
      
      const scan = await storage.getScanById(id);
      if (!scan) {
        return res.status(404).json({ message: 'Scan not found' });
      }
      
      res.json(scan);
    } catch (error) {
      console.error('Error fetching scan:', error);
      res.status(500).json({ message: 'Failed to fetch scan' });
    }
  });

  // Update a scan
  apiRouter.patch("/scans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid scan ID' });
      }
      
      const scan = await storage.getScanById(id);
      if (!scan) {
        return res.status(404).json({ message: 'Scan not found' });
      }
      
      const parseResult = insertScanSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedScan = await storage.updateScan(id, parseResult.data);
      res.json(updatedScan);
    } catch (error) {
      console.error('Error updating scan:', error);
      res.status(500).json({ message: 'Failed to update scan' });
    }
  });

  // Delete a scan
  apiRouter.delete("/scans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid scan ID' });
      }
      
      const success = await storage.deleteScan(id);
      if (!success) {
        return res.status(404).json({ message: 'Scan not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting scan:', error);
      res.status(500).json({ message: 'Failed to delete scan' });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
