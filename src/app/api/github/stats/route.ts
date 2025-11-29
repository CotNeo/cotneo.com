import { NextResponse } from 'next/server';

/**
 * Fallback data when GitHub API is unavailable
 */
const FALLBACK_DATA = {
  user: {
    username: 'cotneo',
    name: 'CotNeo',
    bio: null,
    avatar: 'https://github.com/cotneo.png',
    publicRepos: 30,
    followers: 0,
    following: 0,
    createdAt: '2020-01-01T00:00:00Z'
  },
  repositories: {
    total: 30,
    totalStars: 0,
    totalForks: 0
  },
  languages: [
    { name: 'TypeScript', bytes: 0, percentage: 35.0 },
    { name: 'JavaScript', bytes: 0, percentage: 25.0 },
    { name: 'Python', bytes: 0, percentage: 15.0 },
    { name: 'HTML', bytes: 0, percentage: 10.0 },
    { name: 'CSS', bytes: 0, percentage: 8.0 },
    { name: 'Shell', bytes: 0, percentage: 4.0 },
    { name: 'Dockerfile', bytes: 0, percentage: 2.0 },
    { name: 'Other', bytes: 0, percentage: 1.0 }
  ]
};

/**
 * Fetches comprehensive GitHub statistics including:
 * - User stats (repos, stars, followers, etc.)
 * - Language statistics aggregated from all repositories
 * @returns GitHub statistics object
 */
export async function GET() {
  try {
    console.log('[GitHub Stats API] Fetching GitHub statistics started');
    
    const username = 'cotneo';
    const githubToken = process.env.GITHUB_TOKEN?.trim();
    
    // Build headers with optional authentication
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'cotneo.com'
    };
    
    // Add authentication if token is available (increases rate limit from 60 to 5000/hour)
    if (githubToken && githubToken.length > 0) {
      // Support both 'token TOKEN' and 'Bearer TOKEN' formats
      if (githubToken.startsWith('token ') || githubToken.startsWith('Bearer ')) {
        headers['Authorization'] = githubToken;
      } else {
        headers['Authorization'] = `token ${githubToken}`;
      }
      console.log('[GitHub Stats API] Using authenticated request');
    } else {
      console.warn('[GitHub Stats API] No GITHUB_TOKEN found, using unauthenticated requests (lower rate limit)');
    }

    // 1. Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({}));
      console.error('[GitHub Stats API] User fetch error:', errorData);
      
      // Rate limit exceeded or authentication failed - return fallback data
      if (userResponse.status === 401) {
        console.warn('[GitHub Stats API] Authentication failed (invalid token), returning fallback data');
        return NextResponse.json(
          { 
            ...FALLBACK_DATA,
            _cached: true,
            _message: 'Invalid GitHub token. Please check your GITHUB_TOKEN in .env file. Showing fallback data.'
          },
          { 
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          }
        );
      }
      
      if (userResponse.status === 403 || userResponse.status === 429) {
        console.warn('[GitHub Stats API] Rate limit exceeded, returning fallback data');
        return NextResponse.json(
          { 
            ...FALLBACK_DATA,
            _cached: true,
            _message: 'Rate limit exceeded. Showing cached data. Please add valid GITHUB_TOKEN to .env for real-time data.'
          },
          { 
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          }
        );
      }
      
      // For other errors, also return fallback data instead of throwing
      console.warn('[GitHub Stats API] API error, returning fallback data');
      return NextResponse.json(
        { 
          ...FALLBACK_DATA,
          _cached: true,
          _message: `GitHub API error (${userResponse.status}). Showing fallback data.`
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
          }
        }
      );
    }

    const userData = await userResponse.json();
    console.log('[GitHub Stats API] User data fetched', { 
      repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following 
    });

    // 2. Fetch all repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!reposResponse.ok) {
      // If rate limited or auth failed on repos fetch, return what we have
      if (reposResponse.status === 401 || reposResponse.status === 403 || reposResponse.status === 429) {
        console.warn('[GitHub Stats API] Error on repos fetch, returning partial data');
        return NextResponse.json(
          { 
            user: {
              username: userData.login,
              name: userData.name,
              bio: userData.bio,
              avatar: userData.avatar_url,
              publicRepos: userData.public_repos,
              followers: userData.followers,
              following: userData.following,
              createdAt: userData.created_at
            },
            repositories: {
              total: userData.public_repos,
              totalStars: 0,
              totalForks: 0
            },
            languages: FALLBACK_DATA.languages,
            _cached: true,
            _message: reposResponse.status === 401 
              ? 'Invalid token on repos fetch. Showing partial data.'
              : 'Partial data due to rate limit. Please add valid GITHUB_TOKEN to .env for complete stats.'
          },
          { 
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          }
        );
      }
      // For other errors, return partial data
      console.warn('[GitHub Stats API] Repos fetch error, returning partial data');
      return NextResponse.json(
        { 
          user: {
            username: userData.login,
            name: userData.name,
            bio: userData.bio,
            avatar: userData.avatar_url,
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            createdAt: userData.created_at
          },
          repositories: {
            total: userData.public_repos,
            totalStars: 0,
            totalForks: 0
          },
          languages: FALLBACK_DATA.languages,
          _cached: true,
          _message: `Repos fetch error (${reposResponse.status}). Showing partial data.`
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
          }
        }
      );
    }

    const repos = await reposResponse.json();
    console.log('[GitHub Stats API] Repositories fetched', repos.length);

    // 3. Calculate total stars and forks
    let totalStars = 0;
    let totalForks = 0;
    repos.forEach((repo: { stargazers_count: number; forks_count: number }) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
    });

    // 4. Fetch languages for repositories (with rate limit protection)
    const languageMap = new Map<string, number>();
    // Fetch from more repos if we have a token, limit if no token
    const reposToFetch = githubToken ? repos.slice(0, Math.min(repos.length, 50)) : repos.slice(0, 10);
    
    console.log(`[GitHub Stats API] Fetching languages from ${reposToFetch.length} repositories`);
    
    let successCount = 0;
    let errorCount = 0;
    
    const languagePromises = reposToFetch.map(async (repo: { languages_url: string; name: string }, index: number) => {
      // Add small delay to avoid hitting rate limits (only if no token)
      if (!githubToken && index > 0) {
        await new Promise(resolve => setTimeout(resolve, index * 100));
      }
      
      try {
        const langResponse = await fetch(repo.languages_url, { headers });
        
        if (langResponse.ok) {
          const langData = await langResponse.json();
          const langEntries = Object.entries(langData);
          
          if (langEntries.length > 0) {
            langEntries.forEach(([lang, bytes]) => {
              const currentBytes = languageMap.get(lang) || 0;
              languageMap.set(lang, currentBytes + (bytes as number));
            });
            successCount++;
            console.log(`[GitHub Stats API] Languages fetched for ${repo.name}:`, Object.keys(langData));
          }
        } else if (langResponse.status === 401) {
          const errorData = await langResponse.json().catch(() => ({}));
          console.error(`[GitHub Stats API] Authentication failed for ${repo.name}:`, errorData);
          errorCount++;
        } else if (langResponse.status === 403 || langResponse.status === 429) {
          console.warn(`[GitHub Stats API] Rate limit on ${repo.name}, stopping early`);
          throw new Error('Rate limit exceeded');
        } else {
          console.warn(`[GitHub Stats API] Failed to fetch languages for ${repo.name}: ${langResponse.status}`);
          errorCount++;
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
          throw error;
        }
        console.warn(`[GitHub Stats API] Error fetching languages for ${repo.name}:`, error);
        errorCount++;
      }
    });

    try {
      await Promise.all(languagePromises);
      console.log(`[GitHub Stats API] Language data aggregated: ${languageMap.size} languages from ${successCount} repos (${errorCount} errors)`);
    } catch (error) {
      if (error instanceof Error && error.message === 'Rate limit exceeded') {
        console.warn('[GitHub Stats API] Rate limit during language fetch, using partial data');
      } else {
        console.error('[GitHub Stats API] Error during language fetch:', error);
      }
    }

    // 5. Calculate language percentages
    const totalBytes = Array.from(languageMap.values()).reduce((sum, bytes) => sum + bytes, 0);
    let languages = Array.from(languageMap.entries())
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);
    
    // If no language data, log warning and use fallback
    if (languages.length === 0) {
      console.error('[GitHub Stats API] No language data available!');
      console.error('[GitHub Stats API] Success count:', successCount, 'Error count:', errorCount);
      console.error('[GitHub Stats API] Repos attempted:', reposToFetch.length);
      console.error('[GitHub Stats API] Token present:', !!githubToken);
      console.warn('[GitHub Stats API] Using fallback language data');
      languages = FALLBACK_DATA.languages;
    } else {
      console.log('[GitHub Stats API] Language statistics calculated:', languages.map(l => `${l.name}: ${l.percentage.toFixed(1)}%`));
    }

    const stats = {
      user: {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar_url,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at
      },
      repositories: {
        total: repos.length,
        totalStars,
        totalForks
      },
      languages
    };

    console.log('[GitHub Stats API] Statistics calculated successfully');
    
    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('[GitHub Stats API] Error in route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  );
}

