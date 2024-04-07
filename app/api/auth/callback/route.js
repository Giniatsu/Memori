import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (err) {
      console.log(err)
      console.log("Failed to exchange code for session. User will need to login manually.")
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=EXCHANGE_FAILED`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
