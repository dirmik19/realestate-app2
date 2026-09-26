import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 会員登録画面
export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(`会員登録に失敗しました：${error.message}`)
      return
    }

    // Supabase でメール確認が有効な場合はセッションが返らない
    if (!data.session) {
      setInfo('確認メールを送信しました。メール内のリンクをクリックしてから、ログインしてください。')
      return
    }

    // メール確認が無効な場合はそのままログイン状態になるので物件一覧画面へ
    navigate('/properties', { replace: true })
  }

  return (
    <div className="auth-container">
      <h1>会員登録</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        {error && <p className="message error">{error}</p>}
        {info && <p className="message info">{info}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>
      </form>
      <p className="auth-link">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </div>
  )
}
