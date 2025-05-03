import { bottles, type Bottle, type InsertBottle, scans, type Scan, type InsertScan, users, type User, type InsertUser } from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Modify the interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bottle operations
  getBottles(): Promise<Bottle[]>;
  getBottleById(id: number): Promise<Bottle | undefined>;
  searchBottles(query: string): Promise<Bottle[]>;
  
  // Scan operations
  createScan(scan: InsertScan): Promise<Scan>;
  getScans(userId?: number): Promise<Scan[]>;
  getScanById(id: number): Promise<Scan | undefined>;
  updateScan(id: number, data: Partial<InsertScan>): Promise<Scan | undefined>;
  deleteScan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bottles: Map<number, Bottle>;
  private scans: Map<number, Scan>;
  private userIdCounter: number;
  private scanIdCounter: number;

  constructor() {
    this.users = new Map();
    this.bottles = new Map();
    this.scans = new Map();
    this.userIdCounter = 1;
    this.scanIdCounter = 1;
    
    // Load bottle data from CSV
    this.loadBottlesFromCSV();
  }

  // Load bottles from the CSV file or fallback to embedded dataset for Vercel deployment
  private loadBottlesFromCSV() {
    try {
      let fileContent: string;
      
      try {
        // First try to load from filesystem (works in development)
        const csvPath = path.resolve(process.cwd(), 'attached_assets/dataset.csv');
        fileContent = fs.readFileSync(csvPath, 'utf-8');
      } catch (fsError) {
        console.log("Could not load CSV from file system, using embedded dataset...");
        // In production (e.g., Vercel), load from the embedded dataset
        fileContent = require('./embedded_dataset').bottleData;
      }
      
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === 'id' || 
              context.column === 'brand_id' || 
              context.column === 'popularity' || 
              context.column === 'total_score' || 
              context.column === 'wishlist_count' || 
              context.column === 'vote_count' || 
              context.column === 'bar_count' || 
              context.column === 'ranking') {
            return value ? parseInt(value, 10) : null;
          }
          
          if (context.column === 'proof' || 
              context.column === 'abv' || 
              context.column === 'avg_msrp' || 
              context.column === 'fair_price' || 
              context.column === 'shelf_price') {
            return value ? parseFloat(value) : null;
          }
          
          return value;
        }
      });
      
      records.forEach((record: any) => {
        const bottle: Bottle = {
          id: record.id,
          name: record.name,
          size: record.size,
          proof: record.proof,
          abv: record.abv,
          spirit_type: record.spirit_type,
          brand_id: record.brand_id,
          popularity: record.popularity,
          image_url: record.image_url,
          avg_msrp: record.avg_msrp,
          fair_price: record.fair_price,
          shelf_price: record.shelf_price,
          total_score: record.total_score,
          wishlist_count: record.wishlist_count,
          vote_count: record.vote_count,
          bar_count: record.bar_count,
          ranking: record.ranking
        };
        
        this.bottles.set(bottle.id, bottle);
      });
      
      console.log(`Loaded ${this.bottles.size} bottles from ${this.bottles.size > 0 ? 'dataset' : 'embedded data'}.`);
    } catch (error) {
      console.error("Error loading bottles data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bottle operations
  async getBottles(): Promise<Bottle[]> {
    return Array.from(this.bottles.values());
  }

  async getBottleById(id: number): Promise<Bottle | undefined> {
    return this.bottles.get(id);
  }

  async searchBottles(query: string): Promise<Bottle[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.bottles.values()).filter(
      bottle => bottle.name.toLowerCase().includes(lowerQuery) ||
               (bottle.spirit_type && bottle.spirit_type.toLowerCase().includes(lowerQuery))
    );
  }

  // Scan operations
  async createScan(insertScan: InsertScan): Promise<Scan> {
    const id = this.scanIdCounter++;
    const timestamp = new Date();
    
    // Ensure all properties match the Scan type correctly
    const scan: Scan = { 
      id, 
      bottle_id: insertScan.bottle_id,
      user_id: insertScan.user_id ?? null,
      store_price: insertScan.store_price ?? null,
      confidence: insertScan.confidence ?? null,
      location: insertScan.location ?? null,
      created_at: timestamp 
    };
    
    this.scans.set(id, scan);
    return scan;
  }

  async getScans(userId?: number): Promise<Scan[]> {
    const allScans = Array.from(this.scans.values());
    if (userId) {
      return allScans.filter(scan => scan.user_id === userId);
    }
    return allScans;
  }

  async getScanById(id: number): Promise<Scan | undefined> {
    return this.scans.get(id);
  }

  async updateScan(id: number, data: Partial<InsertScan>): Promise<Scan | undefined> {
    const existingScan = this.scans.get(id);
    if (!existingScan) {
      return undefined;
    }

    // Create a new scan with proper type handling
    const updatedScan: Scan = {
      id: existingScan.id,
      bottle_id: data.bottle_id ?? existingScan.bottle_id,
      user_id: data.user_id ?? existingScan.user_id,
      store_price: data.store_price ?? existingScan.store_price,
      confidence: data.confidence ?? existingScan.confidence,
      location: data.location ?? existingScan.location,
      created_at: existingScan.created_at
    };
    
    this.scans.set(id, updatedScan);
    return updatedScan;
  }

  async deleteScan(id: number): Promise<boolean> {
    return this.scans.delete(id);
  }
}

export const storage = new MemStorage();
