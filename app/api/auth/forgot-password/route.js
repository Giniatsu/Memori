import { NextResponse } from 'next/server'

async function RedirectToPage(request) {
  const url = new URL(request.url)
  const searchParams = request.nextUrl.searchParams;
  
  const basePath = url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : '') + '/forgot-password';
  const queryString = searchParams.toString();
  const urlRedirect = basePath + (queryString ? '?' + queryString : '');

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(urlRedirect)
}

export async function GET(request) {
  return RedirectToPage(request)
}

export async function POST(request) {
  console.log('post')
  return RedirectToPage(request)
}
