import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching GitHub repositories...');
    const response = await fetch(
      'https://api.github.com/users/cotneo/repos?sort=updated&per_page=9',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'cotneo.com'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    console.log('Successfully fetched repositories:', repos.length);

    return NextResponse.json(repos, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error in GitHub API route:', error);
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