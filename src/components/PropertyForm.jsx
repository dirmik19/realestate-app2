import { useState } from 'react'

// 物件の入力フォーム（新規登録・編集の両方で使う）
// initialValues を渡すと編集フォームとして値が入った状態で表示される
export default function PropertyForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent?.toString() ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        rent: Number(rent),
        area: area.trim(),
        layout: layout.trim(),
      })
      // 新規登録フォームの場合は送信後に入力欄を空にする
      if (!initialValues) {
        setName('')
        setRent('')
        setArea('')
        setLayout('')
      }
    } catch (err) {
      setError(`保存に失敗しました：${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <label>
        物件名
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        家賃（円）
        <input
          type="number"
          min="0"
          step="1"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />
      </label>
      <label>
        エリア名
        <input value={area} onChange={(e) => setArea(e.target.value)} required />
      </label>
      <label>
        間取り
        <input
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          placeholder="例：1LDK"
          required
        />
      </label>
      {error && <p className="message error">{error}</p>}
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
