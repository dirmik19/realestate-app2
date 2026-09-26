-- ============================================================
-- 不動産管理アプリ用テーブル
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行してください
-- ============================================================

-- 物件テーブル
create table if not exists public.properties (
  id          bigint generated always as identity primary key,
  -- 登録したユーザー（未指定時はログイン中のユーザーIDが自動で入る）
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) > 0),     -- 物件名
  rent        integer not null check (rent >= 0),               -- 家賃（円）
  area        text not null check (char_length(area) > 0),     -- エリア名
  layout      text not null check (char_length(layout) > 0),   -- 間取り（例：1LDK）
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ユーザーごとの検索を速くするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にするトリガー
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS（行レベルセキュリティ）
-- 自分が登録した物件のみ表示・登録・編集・削除できる
-- ------------------------------------------------------------
alter table public.properties enable row level security;

-- ログインユーザーにテーブル操作を許可（実際にどの行を触れるかは下のポリシーで制限）
grant select, insert, update, delete on public.properties to authenticated;

drop policy if exists "自分の物件のみ表示" on public.properties;
create policy "自分の物件のみ表示"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "自分の物件としてのみ登録" on public.properties;
create policy "自分の物件としてのみ登録"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "自分の物件のみ編集" on public.properties;
create policy "自分の物件のみ編集"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "自分の物件のみ削除" on public.properties;
create policy "自分の物件のみ削除"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
