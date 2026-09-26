import { supabase } from './supabaseClient'

// 物件テーブルへのアクセスをまとめたモジュール
// RLS により、どの関数も自分が登録した物件だけが対象になる

const TABLE = 'properties'
const COLUMNS = 'id, name, rent, area, layout, created_at'

// 一覧取得（SELECT）新しい順
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// 新規登録（INSERT）user_id はDB側の既定値 auth.uid() で自動設定される
export async function createProperty(property) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(property)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// 更新（UPDATE）
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
