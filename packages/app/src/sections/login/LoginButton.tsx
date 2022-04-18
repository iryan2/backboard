import React from 'react'

const config = {
  authApi: 'https://whoamong.us',
  authPath: '/.netlify/functions/auth',
  origin: window.location.href,
}

export const LoginButton = () => (
  <a
    href={`${config.authApi}${config.authPath}?origin=${config.origin}`}
    style={{ textDecoration: 'none', color: 'var(--text-color)' }}
  >
    Login
  </a>
)
