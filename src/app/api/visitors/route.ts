import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

interface VisitorData {
  currentCount: number;
  history: Array<{
    timestamp: string;
    count: number;
    visitorId?: string;
    ip?: string;
    userAgent?: string;
  }>;
}

interface SessionData {
  [visitorId: string]: number;
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
async function loadSessions() {
  try {
    await ensureDataDir();
    const fileContent = await readFile(SESSIONS_FILE, 'utf-8');
    const sessions: SessionData = JSON.parse(fileContent);
    visitorSessions = new Map(Object.entries(sessions));
  } catch (error) {
    visitorSessions = new Map();
    // İlk kez çalıştığında dosyayı oluştur
    await saveSessions();
  }
}

// Oturum verilerini kaydet
async function saveSessions() {
  try {
    await ensureDataDir();
    const sessions: SessionData = Object.fromEntries(visitorSessions);
    await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Session save error:', error);
  }
}

// Ziyaretçi verilerini yükle
async function loadVisitorData(): Promise<VisitorData> {
  try {
    await ensureDataDir();
    const fileContent = await readFile(VISITORS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    const initialData: VisitorData = {
      currentCount: 0,
      history: []
    };
    await writeFile(VISITORS_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// Ziyaretçi verilerini kaydet
async function saveVisitorData(data: VisitorData) {
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

export async function GET(request: Request) {
  try {
    // Oturum verilerini yükle
    await loadSessions();

    // Çerezleri kontrol et
    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitorId')?.value;
    const consent = cookieStore.get('consent')?.value;

    // Eğer çerez yoksa veya onay verilmemişse yeni bir ID oluştur
    if (!visitorId || consent !== 'true') {
      visitorId = generateVisitorId();
    }

    const now = Date.now();
    
    // Eski oturumları temizle (5 dakikadan eski)
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    for (const [id, timestamp] of visitorSessions.entries()) {
      if (timestamp < fiveMinutesAgo) {
        visitorSessions.delete(id);
      }
    }
    await saveSessions();
    
    // Mevcut verileri oku
    const data = await loadVisitorData();

    // Eğer bu ziyaretçi son 5 dakika içinde geldiyse, sayacı artırma
    const lastVisit = visitorSessions.get(visitorId);
    if (lastVisit && (now - lastVisit) < 5 * 60 * 1000) {
      // Aktif ziyaretçi sayısını hesapla
      const activeVisitors = calculateActiveVisitors(now);
      
      const response = NextResponse.json({
        ...data,
        activeVisitors,
        requiresConsent: consent !== 'true'
      });

      if (consent === 'true') {
        response.cookies.set('visitorId', visitorId, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true
        });

        response.cookies.set('consent', 'true', {
          maxAge: 365 * 24 * 60 * 60,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true
        });
      }

      return response;
    }

    // Ziyaretçinin son ziyaret zamanını güncelle
    visitorSessions.set(visitorId, now);
    await saveSessions();

    // Sayaç ve geçmişi güncelle
    data.currentCount += 1;
    const timestamp = new Date().toISOString();
    data.history.push({
      timestamp,
      count: data.currentCount,
      visitorId
    });

    // Son 24 saatlik veriyi tut
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    data.history = data.history.filter(item => new Date(item.timestamp) > oneDayAgo);

    // Verileri kaydet
    await saveVisitorData(data);

    // Aktif ziyaretçi sayısını hesapla
    const activeVisitors = calculateActiveVisitors(now);

    const response = NextResponse.json({
      ...data,
      activeVisitors,
      requiresConsent: consent !== 'true'
    });

    if (consent === 'true') {
      response.cookies.set('visitorId', visitorId, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      });

      response.cookies.set('consent', 'true', {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      });
    }

    return response;
  } catch (error) {
    console.error('Error handling visitor count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update visitor count',
        currentCount: 0,
        history: [],
        activeVisitors: 0,
        requiresConsent: true
      },
      { status: 200 } // 500 yerine 200 döndür, client tarafında daha iyi ele alınabilir
    );
  }
}

export async function POST(req: Request) {
  try {
    const { ip, userAgent } = await req.json();

    if (!ip || !userAgent) {
      return NextResponse.json(
        { error: 'IP ve User-Agent gerekli' },
        { status: 400 }
      );
    }

    const data = await loadVisitorData();

    // Yeni ziyaretçi kaydı ekle
    const timestamp = new Date().toISOString();
    data.history.push({
      timestamp,
      count: data.currentCount + 1,
      ip,
      userAgent
    });

    // Son 24 saatlik veriyi tut
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    data.history = data.history.filter(item => new Date(item.timestamp) > oneDayAgo);

    // Verileri kaydet
    await saveVisitorData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving visitor data:', error);
    return NextResponse.json(
      { error: 'Failed to save visitor data' },
      { status: 200 } // 500 yerine 200 döndür
    );
  }
} 