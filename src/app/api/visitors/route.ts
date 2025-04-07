import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

// Constants
const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Types
interface SessionData {
  id: string;
  lastActive: string;
  ip: string;
  userAgent: string;
}

interface VisitorData {
  timestamp: string;
  count: number;
  ip: string;
  userAgent: string;
}

interface ApiResponse {
  currentCount: number;
  history: VisitorData[];
  activeVisitors: number;
  visitorId?: string;
  error?: string;
}

// Services
class FileService {
  static async ensureDataDir() {
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (error: unknown) {
      console.error('Error creating data directory:', error);
    }
  }

  static async readJsonFile<T>(filePath: string): Promise<T> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error: unknown) {
      console.error(`Error reading file ${filePath}:`, error);
      return [] as T;
    }
  }

  static async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    try {
      await writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      console.error(`Error writing file ${filePath}:`, error);
      throw error;
    }
  }
}

class SessionService {
  private static sessions: Map<string, SessionData> = new Map();
  private static readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  static async loadSessions(): Promise<void> {
    try {
      const sessions: SessionData[] = await FileService.readJsonFile(SESSIONS_FILE);
      this.sessions = new Map(sessions.map(session => [session.id, session]));
      this.cleanupOldSessions();
    } catch (error: unknown) {
      console.error('Error loading sessions:', error);
      this.sessions = new Map();
    }
  }

  static async saveSessions(): Promise<void> {
    try {
      this.cleanupOldSessions();
      const sessions: SessionData[] = Array.from(this.sessions.values());
      await FileService.writeJsonFile(SESSIONS_FILE, sessions);
    } catch (error: unknown) {
      console.error('Error saving sessions:', error);
      throw error;
    }
  }

  static updateSession(id: string, ip: string, userAgent: string): void {
    const now = new Date().toISOString();
    this.sessions.set(id, { id, lastActive: now, ip, userAgent });
    this.cleanupOldSessions();
  }

  static getActiveSessions(): number {
    this.cleanupOldSessions();
    return this.sessions.size;
  }

  private static cleanupOldSessions(): void {
    const now = Date.now();
    const cutoffTime = new Date(now - this.SESSION_TIMEOUT).toISOString();

    for (const [id, session] of this.sessions.entries()) {
      if (session.lastActive < cutoffTime) {
        this.sessions.delete(id);
      }
    }
  }

  static isExistingSession(ip: string, userAgent: string): boolean {
    return Array.from(this.sessions.values()).some(
      session => session.ip === ip && session.userAgent === userAgent
    );
  }
}

class VisitorService {
  static async loadVisitorData(): Promise<VisitorData[]> {
    try {
      return await FileService.readJsonFile<VisitorData[]>(VISITORS_FILE);
    } catch (error: unknown) {
      console.error('Error loading visitor data:', error);
      return [];
    }
  }

  static async saveVisitorData(data: VisitorData[]): Promise<void> {
    try {
      await FileService.writeJsonFile(VISITORS_FILE, data);
    } catch (error: unknown) {
      console.error('Error saving visitor data:', error);
      throw error;
    }
  }

  static async addVisitor(ip: string, userAgent: string): Promise<void> {
    try {
      const visitorData = await this.loadVisitorData();
      const now = new Date();
      
      // Son 24 saatteki ziyaretçileri filtrele
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentVisitors = visitorData.filter(item => 
        new Date(item.timestamp) >= oneDayAgo
      );

      // Yeni ziyaretçi ekle
      const newVisitor: VisitorData = {
        timestamp: now.toISOString(),
        count: recentVisitors.length + 1,
        ip,
        userAgent
      };

      // Son 24 saatteki verileri koru ve yeni ziyaretçiyi ekle
      const updatedData = [...recentVisitors, newVisitor];
      await this.saveVisitorData(updatedData);

      console.log('New visitor added:', {
        timestamp: newVisitor.timestamp,
        count: newVisitor.count,
        ip: newVisitor.ip
      });
    } catch (error: unknown) {
      console.error('Error adding visitor:', error);
      throw error;
    }
  }

  static async getVisitorStats(): Promise<ApiResponse> {
    try {
      const visitorData = await this.loadVisitorData();
      const now = new Date();
      
      // Son 24 saatteki ziyaretçileri filtrele
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentVisitors = visitorData.filter(item => 
        new Date(item.timestamp) >= oneDayAgo
      );

      // Bugünün başlangıcını hesapla
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Aktif ziyaretçi sayısını hesapla (son 5 dakika)
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const activeVisitors = recentVisitors.filter(item => 
        new Date(item.timestamp) >= fiveMinutesAgo
      ).length;

      return {
        currentCount: recentVisitors.length,
        history: recentVisitors,
        activeVisitors
      };
    } catch (error: unknown) {
      console.error('Error getting visitor stats:', error);
      return {
        currentCount: 0,
        history: [],
        activeVisitors: 0,
        error: 'Failed to get visitor stats'
      };
    }
  }
}

// Helper Functions
function getClientInfo(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return { ip, userAgent };
}

function generateVisitorId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// API Handlers
export async function GET() {
  try {
    console.log('GET /api/visitors called');
    await FileService.ensureDataDir();
    await SessionService.loadSessions();
    
    const stats = await VisitorService.getVisitorStats();
    const visitorId = generateVisitorId();

    console.log('Visitor stats:', {
      currentCount: stats.currentCount,
      activeVisitors: stats.activeVisitors,
      visitorId,
      sessions: Array.from(SessionService['sessions'].values())
    });

    return NextResponse.json({
      currentCount: stats.currentCount,
      history: stats.history,
      activeVisitors: stats.activeVisitors,
      visitorId
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/visitors:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch visitor data',
        currentCount: 0,
        history: [],
        activeVisitors: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/visitors called');
    const { ip, userAgent } = getClientInfo(request);
    
    await FileService.ensureDataDir();
    await SessionService.loadSessions();
    
    // Check if visitor already exists in the last 24 hours
    const visitorData = await VisitorService.loadVisitorData();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVisitors = visitorData.filter(item => 
      new Date(item.timestamp) >= oneDayAgo && 
      item.ip === ip && 
      item.userAgent === userAgent
    );

    // Only add new visitor if not already counted in last 24 hours
    if (recentVisitors.length === 0) {
      await VisitorService.addVisitor(ip, userAgent);
      console.log('New visitor added:', { ip, userAgent });
    } else {
      console.log('Visitor already counted in last 24 hours:', { ip, userAgent });
    }

    const visitorId = generateVisitorId();
    
    // Only update session if it's a new session
    if (!SessionService.isExistingSession(ip, userAgent)) {
      SessionService.updateSession(visitorId, ip, userAgent);
      await SessionService.saveSessions();
    }

    const stats = await VisitorService.getVisitorStats();
    console.log('Updated visitor stats:', {
      currentCount: stats.currentCount,
      activeVisitors: stats.activeVisitors,
      sessions: Array.from(SessionService['sessions'].values())
    });

    return NextResponse.json({ 
      success: true,
      message: 'Visitor data updated successfully',
      stats
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/visitors:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update visitor data',
        success: false
      },
      { status: 500 }
    );
  }
} 