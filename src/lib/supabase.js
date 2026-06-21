import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Gracefully degrade when env vars are not set (local dev without Supabase)
export const supabase = url && key ? createClient(url, key) : null

export async function saveResult({ id, typeKey, userName, answers }) {
  if (!supabase) return null
  const { error } = await supabase.from('results').insert({
    id,
    type_key: typeKey,
    user_name: userName || null,
    answers,
  })
  if (error) console.error('Supabase insert error:', error)
  return error ? null : id
}

export async function loadResult(id) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}
