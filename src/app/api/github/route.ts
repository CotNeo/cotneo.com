import { NextResponse } from 'next/server';

/**
 * List of specific repositories to fetch and display
 */
const TARGET_REPOS = [
  'cotneo.com',
  'ai_dub',
  'educationalContentProductionPipeline',
  'ai-vesilalik',
  'ops',
  'ecommerce',
  'nutrition_app',
  'playable-factory',
  'destan-finansal-nextjs'
];

/**
 * Fetches specific GitHub repositories by name
 * @returns Array of repository data
 */
export async function GET() {
  try {
    console.log('[GitHub API] Fetching specific repositories...', TARGET_REPOS);
    
    // Fetch all repositories to filter for specific ones
    const response = await fetch(
      'https://api.github.com/users/cotneo/repos?sort=updated&per_page=100',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'cotneo.com'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GitHub API] Error:', errorData);
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const allRepos = await response.json();
    console.log('[GitHub API] Total repositories fetched:', allRepos.length);

    // Filter for target repositories
    const filteredRepos = allRepos.filter((repo: { name: string }) => 
      TARGET_REPOS.includes(repo.name)
    );

    // Sort by the order specified in TARGET_REPOS
    const sortedRepos = TARGET_REPOS
      .map(repoName => filteredRepos.find((repo: { name: string }) => repo.name === repoName))
      .filter(Boolean); // Remove any undefined values (repos that don't exist)

    console.log('[GitHub API] Successfully filtered repositories:', sortedRepos.length);
    console.log('[GitHub API] Repository names:', sortedRepos.map((r: { name: string }) => r.name));

    return NextResponse.json(sortedRepos, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('[GitHub API] Error in route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub repositories',
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