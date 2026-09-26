import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// ログイン状態をアプリ全体で共有するためのコンテキスト
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション確認が終わるまでは true
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に保存済みのセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの状態変化を監視する
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // 画面を離れるときに監視を解除する
    return () => data.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    // 会員登録
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    // ログイン
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    // ログアウト
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 各コンポーネントからログイン状態を取得するためのフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}
