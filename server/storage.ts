import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
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
  searchChefs(filters: {
    location?: string;
    specialties?: string[];
    maxPrice?: number;
    minRating?: number;
  }): Promise<ChefWithUser[]>;
  getFeaturedChefs(): Promise<ChefWithUser[]>;

  // Services
  getService(id: number): Promise<Service | undefined>;
  getServicesByChef(chefId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingWithDetails(id: number): Promise<BookingWithDetails | undefined>;
  getBookingsByCustomer(customerId: number): Promise<BookingWithDetails[]>;
  getBookingsByChef(chefId: number): Promise<BookingWithDetails[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByChef(chefId: number): Promise<Review[]>;
  getReviewsByCustomer(customerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByBooking(bookingId: number): Promise<Message[]>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;

  // Newsletter
  subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;
  getNewsletterSubscription(email: string): Promise<Newsletter | undefined>;

  // Job Applications
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(): Promise<JobApplication[]>;
  getJobApplication(id: number): Promise<JobApplication | undefined>;

  // Chef Quiz
  createChefQuiz(quiz: InsertChefQuiz): Promise<ChefQuiz>;
  getChefQuiz(chefId: number): Promise<ChefQuiz | undefined>;
  updateChefQuiz(chefId: number, updates: Partial<ChefQuiz>): Promise<ChefQuiz | undefined>;
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
      .leftJoin(services, eq(chefs.id, services.chefId))
      .leftJoin(reviews, eq(chefs.id, reviews.chefId))
      .where(eq(chefs.id, id));
    
    if (result.length === 0) return undefined;
    
    const chef = result[0].chefs;
    const user = result[0].users;
    const chefServices = result.map(r => r.services).filter(Boolean);
    const chefReviews = result.map(r => r.reviews).filter(Boolean);
    
    return {
      ...chef,
      user,
      services: chefServices,
      reviews: chefReviews
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

  async searchChefs(filters: {
    location?: string;
    specialties?: string[];
    maxPrice?: number;
    minRating?: number;
  }): Promise<ChefWithUser[]> {
    const query = db.select()
      .from(chefs)
      .innerJoin(users, eq(chefs.userId, users.id))
      .where(eq(chefs.isApproved, true));
    
    const result = await query;
    
    return result.map(r => ({
      ...r.chefs,
      user: r.users,
      services: [],
      reviews: []
    }));
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

  async updateService(id: number, updates: Partial<Service>): Promise<Service | undefined> {
    const result = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount > 0;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async getBookingWithDetails(id: number): Promise<BookingWithDetails | undefined> {
    const result = await db.select()
      .from(bookings)
      .innerJoin(users, eq(bookings.customerId, users.id))
      .innerJoin(chefs, eq(bookings.chefId, chefs.id))
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].bookings,
      customer: result[0].users,
      chef: {
        ...result[0].chefs,
        user: result[0].users
      },
      service: result[0].services
    };
  }

  async getBookingsByCustomer(customerId: number): Promise<BookingWithDetails[]> {
    const result = await db.select()
      .from(bookings)
      .innerJoin(users, eq(bookings.customerId, users.id))
      .innerJoin(chefs, eq(bookings.chefId, chefs.id))
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.customerId, customerId));
    
    return result.map(r => ({
      ...r.bookings,
      customer: r.users,
      chef: {
        ...r.chefs,
        user: r.users
      },
      service: r.services
    }));
  }

  async getBookingsByChef(chefId: number): Promise<BookingWithDetails[]> {
    const result = await db.select()
      .from(bookings)
      .innerJoin(users, eq(bookings.customerId, users.id))
      .innerJoin(chefs, eq(bookings.chefId, chefs.id))
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.chefId, chefId));
    
    return result.map(r => ({
      ...r.bookings,
      customer: r.users,
      chef: {
        ...r.chefs,
        user: r.users
      },
      service: r.services
    }));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async getReview(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async getReviewsByChef(chefId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.chefId, chefId));
  }

  async getReviewsByCustomer(customerId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.customerId, customerId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async getMessagesByBooking(bookingId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.bookingId, bookingId));
  }

  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        and(
          eq(messages.senderId, user1Id),
          eq(messages.receiverId, user2Id)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
    return result.rowCount > 0;
  }

  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    const result = await db.insert(newsletter).values(newsletterData).returning();
    return result[0];
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const result = await db.update(newsletter).set({ isActive: false }).where(eq(newsletter.email, email));
    return result.rowCount > 0;
  }

  async getNewsletterSubscription(email: string): Promise<Newsletter | undefined> {
    const result = await db.select().from(newsletter).where(eq(newsletter.email, email));
    return result[0];
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const result = await db.insert(jobApplications).values(application).returning();
    return result[0];
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  }

  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    const result = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return result[0];
  }

  async createChefQuiz(quiz: InsertChefQuiz): Promise<ChefQuiz> {
    const result = await db.insert(chefQuizzes).values(quiz).returning();
    return result[0];
  }

  async getChefQuiz(chefId: number): Promise<ChefQuiz | undefined> {
    const result = await db.select().from(chefQuizzes).where(eq(chefQuizzes.chefId, chefId));
    return result[0];
  }

  async updateChefQuiz(chefId: number, updates: Partial<ChefQuiz>): Promise<ChefQuiz | undefined> {
    const result = await db.update(chefQuizzes).set(updates).where(eq(chefQuizzes.chefId, chefId)).returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
