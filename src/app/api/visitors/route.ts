import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

interface SessionData {
  id: string;
  lastActive: string;
}

interface VisitorData {
  timestamp: string;
  count: number;
  ip: string;
  userAgent: string;
}

// Ziyaretçi oturumlarını saklamak için geçici depolama
let visitorSessions: Map<string, number> = new Map();

// Dosya sistemini hazırla
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Klasör zaten varsa hata vermez
  }
}

// Oturum verilerini yükle
async function loadSessions(): Promise<SessionData[]> {
  try {
    await ensureDataDir();
    const fileContent = await readFile(SESSIONS_FILE, 'utf-8');
    const sessions: SessionData[] = JSON.parse(fileContent);
    visitorSessions = new Map(sessions.map(session => [session.id, new Date(session.lastActive).getTime()]));
    return sessions;
  } catch (error) {
    visitorSessions = new Map();
    return [];
  }
}

// Oturum verilerini kaydet
async function saveSessions() {
  try {
    await ensureDataDir();
    const sessions: SessionData[] = Array.from(visitorSessions.entries()).map(([id, lastActive]) => ({
      id,
      lastActive: new Date(lastActive).toISOString()
    }));
    await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Session save error:', error);
  }
}

// Ziyaretçi verilerini yükle
async function loadVisitorData(): Promise<VisitorData[]> {
  try {
    await ensureDataDir();
    const fileContent = await readFile(VISITORS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    const initialData: VisitorData[] = [];
    await writeFile(VISITORS_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// Ziyaretçi verilerini kaydet
async function saveVisitorData(data: VisitorData[]) {
  try {
    await ensureDataDir();
    await writeFile(VISITORS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Visitor data save error:', error);
    throw error;
  }
}

// Benzersiz ziyaretçi ID'si oluştur
function generateVisitorId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Aktif ziyaretçi sayısını hesapla
function calculateActiveVisitors(now: number): number {
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  const uniqueIPs = new Set<string>();
  
  for (const [ip, timestamp] of visitorSessions.entries()) {
    if (timestamp >= fiveMinutesAgo) {
      uniqueIPs.add(ip);
    }
  }
  
  return uniqueIPs.size;
}

export async function GET() {
  try {
    await ensureDataDir();
    
    const sessions = await loadSessions() as SessionData[];
    const visitorData = await loadVisitorData() as VisitorData[];
    
    // Calculate active visitors
    const now = new Date();
    const activeVisitors = sessions.filter((session: SessionData) => {
      const lastActive = new Date(session.lastActive);
      return now.getTime() - lastActive.getTime() < 5 * 60 * 1000; // 5 minutes
    }).length;

    // Calculate total visitors
    const totalVisitors = visitorData.length;

    // Generate a new visitor ID if needed
    const visitorId = crypto.randomUUID();

    return NextResponse.json({
      visitors: visitorData,
      totalVisitors,
      activeVisitors,
      visitorId,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in GET /api/visitors:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch visitor data',
        visitors: [],
        totalVisitors: 0,
        activeVisitors: 0,
        lastUpdate: new Date().toISOString()
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { ip, userAgent } = await request.json();
    
    if (!ip || !userAgent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await ensureDataDir();
    
    const visitorData = await loadVisitorData() as VisitorData[];
    const now = new Date();
    
    // Add new visitor entry
    visitorData.push({
      timestamp: now.toISOString(),
      count: visitorData.length + 1,
      ip,
      userAgent
    });

    // Keep only last 24 hours of data
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const filteredData = visitorData.filter((item: VisitorData) => 
      new Date(item.timestamp) >= oneDayAgo
    );

    await saveVisitorData(filteredData);

    return NextResponse.json({ 
      success: true,
      message: 'Visitor data updated successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/visitors:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update visitor data',
        success: false
      },
      { status: 200 }
    );
  }
} 