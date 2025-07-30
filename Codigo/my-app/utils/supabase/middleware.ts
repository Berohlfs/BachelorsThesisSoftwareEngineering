import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from './supabase-types'

export const cardapio_regex = /^\/cardapio\/[^/]+$/
export const evento_regex = /^\/meus-eventos\/[^/]+$/
export const produto_regex = /^\/meus-produtos\/[^/]+$/
export const resumo_compra_regex = /^\/resumo-compra\/[^/]+$/
export const compra_regex = /^\/compra\/[^/]+$/




export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminRoutes = [evento_regex,produto_regex, '/dashboard', '/meus-eventos', '/meus-produtos', '/profile-admin']

  const buyerRoutes = [cardapio_regex, '/profile', '/minhas-compras','/sucesso-compra', compra_regex, '/resumo-compra' ]

  const isAdminRoute = adminRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(request.nextUrl.pathname)
    }
    return request.nextUrl.pathname === route
  })

  const isBuyerRoute = buyerRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(request.nextUrl.pathname)
    }
    return request.nextUrl.pathname === route
  })

  const isPublicRoute = !(isBuyerRoute || isAdminRoute)

  const url = request.nextUrl.clone()

  if (user) {
    //console.log(user.user_metadata)
    if (isPublicRoute) {
      if (user.user_metadata.role === 'admin') {
        url.pathname = '/dashboard'
      } else {
        url.pathname = '/minhas-compras'
      }
      return NextResponse.redirect(url)
    } else {
      if(isAdminRoute && user.user_metadata.role !== 'admin'){
        url.pathname = '/minhas-compras'
        return NextResponse.redirect(url)
      }else if(isBuyerRoute && user.user_metadata.role === 'admin'){
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } else {
    if(!isPublicRoute){
      if ((buyerRoutes[0] as RegExp).test(request.nextUrl.pathname)) {
        url.pathname = '/quick-login'
        url.search = `?redirect=${request.nextUrl.pathname}`
      } else {
        url.pathname = '/'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}