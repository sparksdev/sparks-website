import { NextResponse } from 'next/server'

export const rewrites = []

export const redirects = [
  { subdomain: 'linktree', href: `${process.env.ORIGIN}/#links` },
  { subdomain: 'links', href: `${process.env.ORIGIN}/#links` },
  { subdomain: 'discord', href: 'https://discord.com/invite/JuNWR6vGKC' },
  { subdomain: 'twitter', href: 'https://twitter.com/sparksdev_' },
  { subdomain: 'github', href: 'https://github.com/sparksdev' },
  { subdomain: 'gitcoin', href: 'https://gitcoin.co/sparksdev' },
  { subdomain: 'medium', href: 'https://medium.com/@sparksdev' },
  { subdomain: 'telegram', href: 'https://t.me/sparks_official' },
  { subdomain: 'notion', href: 'https://sparksdev.notion.site/sparksdev/SPARKS-b3450f9c62d74923960f69eece7be6c3' },
]

export function middleware(req) {
  const subdomain = req.headers.get('host').split('.')[0]
  const redirect = redirects.find((r) => r.subdomain === subdomain)
  if (redirect) return NextResponse.redirect(redirect.href, 308)
  const rewrite = rewrites.find((r) => r.subdomain === subdomain)
  if (rewrite) return NextResponse.rewrite(rewrite.href)
}
