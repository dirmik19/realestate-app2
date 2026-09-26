import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件ID（null のときは編集していない）
  const [editingId, setEditingId] = useState(null)

  // 画面表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
  }

  // 編集内容の保存
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除（確認ダイアログを出してから実行）
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return
    setError('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

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

      <section className="panel">
        <h2>物件を登録</h2>
        <PropertyForm submitLabel="登録する" onSubmit={handleCreate} />
      </section>

      {error && <p className="message error">{error}</p>}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty">登録された物件はまだありません。</p>
      ) : (
        <ul className="card-list">
          {properties.map((property) => (
            <li key={property.id} className="card">
              {editingId === property.id ? (
                // 編集モード：カード内に編集フォームを表示
                <PropertyForm
                  initialValues={property}
                  submitLabel="保存する"
                  onSubmit={(values) => handleUpdate(property.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                // 表示モード
                <>
                  <h2>{property.name}</h2>
                  <p className="rent">
                    家賃：{property.rent.toLocaleString('ja-JP')}円/月
                  </p>
                  <p className="area">エリア：{property.area}</p>
                  <p className="area">間取り：{property.layout}</p>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setEditingId(property.id)}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(property)}
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
