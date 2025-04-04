import { useState, useEffect } from 'react'

function getCookie(name1) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === name1) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const sessionId = getCookie('sessionid')
    setIsAuth(!!sessionId)
  }, [])

  return {isAuth}
}