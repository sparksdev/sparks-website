import { NextResponse } from 'next/server'

export const rewrites = []

export const redirects = [
  { subdomain: 'root', href: 'https://sparks.foundation' },
  { subdomain: 'linktree', href: `https://links.sparks.foundation` },
  { subdomain: 'links', href: `https://links.sparks.foundation` },
  { subdomain: 'discord', href: 'https://discord.sparks.foundation' },
  { subdomain: 'twitter', href: 'https://twitter.sparks.foundation_' },
  { subdomain: 'github', href: 'https://github.sparks.foundation' },
  { subdomain: 'gitcoin', href: 'https://gitbook.sparks.foundation' },
  { subdomain: 'medium', href: 'https://gitbook.sparks.foundation' },
  { subdomain: 'telegram', href: 'https://telegram.sparks.foundation' },
  { subdomain: 'notion', href: 'https://gitbook.sparks.foundation' },
]

export function middleware(req) {
  const subdomain = req.headers.get('host').split('.')[0] || 'root'
  const redirect = redirects.find((r) => r.subdomain === subdomain)
  if (redirect) return NextResponse.redirect(redirect.href, 308)
  const rewrite = rewrites.find((r) => r.subdomain === subdomain)
  if (rewrite) return NextResponse.rewrite(rewrite.href)
}
