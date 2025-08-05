import { NextResponse } from 'next/server';
import client, { News } from 'chainecho-api';

export async function GET() {
  const CHAINECHO_API_KEY = '6iWil6rWrWOOjpu0SpOfFEc9PuUpj8rE';
  client.setToken(CHAINECHO_API_KEY);

  try {
    const news: News[] = await client.getLatestNews(50);
    return NextResponse.json(news);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from ChainEcho API' },
      { status: 500 }
    );
  }
}
