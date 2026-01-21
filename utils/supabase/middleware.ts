import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()


    const publicPaths = [
        '/',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/auth',
        '/pricing',
        '/contact',
        '/faq',
        '/terms',
        '/aml-kyc',
        '/use-cases',
        '/how-it-works',
        '/security',
        '/api'
    ]

    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path) || request.nextUrl.pathname === '/'
    )

    if (!user && !isPublicPath) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return response
}
