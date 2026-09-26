import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-user">
          <span>{user?.email}</span>
          <button type="button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <ul className="card-list">
        {properties.map((property) => (
          <li key={property.id} className="card">
            <h2>{property.name}</h2>
            <p className="rent">
              家賃：{property.rent.toLocaleString('ja-JP')}円/月
            </p>
            <p className="area">エリア：{property.area}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
