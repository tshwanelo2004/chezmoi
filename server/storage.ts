import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { 
  users, chefs, services, bookings, reviews, messages, newsletter, jobApplications, chefQuizzes,
  type User, type InsertUser, 
  type Chef, type InsertChef, type ChefWithUser,
  type Service, type InsertService,
  type Booking, type InsertBooking, type BookingWithDetails,
  type Review, type InsertReview,
  type Message, type InsertMessage,
  type Newsletter, type InsertNewsletter,
  type JobApplication, type InsertJobApplication,
  type ChefQuiz, type InsertChefQuiz
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId?(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Chefs
  getChef(id: number): Promise<Chef | undefined>;
  getChefWithUser(id: number): Promise<ChefWithUser | undefined>;
  getChefByUserId(userId: number): Promise<Chef | undefined>;
  createChef(chef: InsertChef): Promise<Chef>;
  updateChef(id: number, updates: Partial<Chef>): Promise<Chef | undefined>;
  getFeaturedChefs(): Promise<ChefWithUser[]>;

  // Services
  getService(id: number): Promise<Service | undefined>;
  getServicesByChef(chefId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;

  // Newsletter
  subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;

  // Job Applications
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;

  // Chef Quiz
  createChefQuiz(quiz: InsertChefQuiz): Promise<ChefQuiz>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getChef(id: number): Promise<Chef | undefined> {
    const result = await db.select().from(chefs).where(eq(chefs.id, id));
    return result[0];
  }

  async getChefWithUser(id: number): Promise<ChefWithUser | undefined> {
    const result = await db.select()
      .from(chefs)
      .innerJoin(users, eq(chefs.userId, users.id))
      .where(eq(chefs.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].chefs,
      user: result[0].users,
      services: [],
      reviews: []
    };
  }

  async getChefByUserId(userId: number): Promise<Chef | undefined> {
    const result = await db.select().from(chefs).where(eq(chefs.userId, userId));
    return result[0];
  }

  async createChef(chef: InsertChef): Promise<Chef> {
    const result = await db.insert(chefs).values(chef).returning();
    return result[0];
  }

  async updateChef(id: number, updates: Partial<Chef>): Promise<Chef | undefined> {
    const result = await db.update(chefs).set(updates).where(eq(chefs.id, id)).returning();
    return result[0];
  }

  async getFeaturedChefs(): Promise<ChefWithUser[]> {
    const result = await db.select()
      .from(chefs)
      .innerJoin(users, eq(chefs.userId, users.id))
      .where(and(eq(chefs.isApproved, true), eq(chefs.isAvailable, true)))
      .orderBy(desc(chefs.rating))
      .limit(6);
    
    return result.map(r => ({
      ...r.chefs,
      user: r.users,
      services: [],
      reviews: []
    }));
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async getServicesByChef(chefId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.chefId, chefId));
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async updateService(id: number
