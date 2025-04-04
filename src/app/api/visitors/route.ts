import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const VISITORS_FILE = path.join(process.cwd(), 'public', 'visitors.json');
const SESSIONS_FILE = path.join(process.cwd(), 'public', 'sessions.json');

interface VisitorData {
  currentCount: number;
  history: Array<{
    timestamp: string;
    count: number;
    visitorId?: string;
  }>;
}

interface SessionData {
  [visitorId: string]: number;
}

// Ziyaretçi oturumlarını saklamak için geçici depolama
let visitorSessions: Map<string, number> = new Map();

// Oturum verilerini yükle
async function loadSessions() {
  try {
    const fileContent = await readFile(SESSIONS_FILE, 'utf-8');
    const sessions: SessionData = JSON.parse(fileContent);
    visitorSessions = new Map(Object.entries(sessions));
  } catch (error) {
    visitorSessions = new Map();
  }
}

// Oturum verilerini kaydet
async function saveSessions() {
  const sessions: SessionData = Object.fromEntries(visitorSessions);
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// Benzersiz ziyaretçi ID'si oluştur
function generateVisitorId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Aktif ziyaretçi sayısını hesapla
function calculateActiveVisitors(now: number): number {
  // Son 5 dakika içinde gelen benzersiz IP'leri say
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
    let data: VisitorData;
    try {
      const fileContent = await readFile(VISITORS_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      data = {
        currentCount: 0,
        history: []
      };
      // Dosya yoksa oluştur
      await writeFile(VISITORS_FILE, JSON.stringify(data, null, 2));
    }

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

      // Çerez onayı varsa çerezleri ayarla
      if (consent === 'true') {
        // Ziyaretçi ID çerezi
        response.cookies.set('visitorId', visitorId, {
          maxAge: 30 * 24 * 60 * 60, // 30 gün
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true
        });

        // Onay çerezi
        response.cookies.set('consent', 'true', {
          maxAge: 365 * 24 * 60 * 60, // 1 yıl
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
    await writeFile(VISITORS_FILE, JSON.stringify(data, null, 2));

    // Aktif ziyaretçi sayısını hesapla
    const activeVisitors = calculateActiveVisitors(now);

    const response = NextResponse.json({
      ...data,
      activeVisitors,
      requiresConsent: consent !== 'true'
    });

    // Çerez onayı varsa çerezleri ayarla
    if (consent === 'true') {
      // Ziyaretçi ID çerezi
      response.cookies.set('visitorId', visitorId, {
        maxAge: 30 * 24 * 60 * 60, // 30 gün
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      });

      // Onay çerezi
      response.cookies.set('consent', 'true', {
        maxAge: 365 * 24 * 60 * 60, // 1 yıl
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
      { status: 500 }
    );
  }
} 