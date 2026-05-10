import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchBiens(filters?: {
  transaction?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  type_bien?: string;
  search?: string;
  sort?: string;
}) {
  let query = supabase
    .from('biens')
    .select('*')
    .eq('statut', 'disponible')
    .not('proprietaire_id', 'is', null);

  if (filters?.transaction && filters.transaction !== 'all') {
    query = query.eq('transaction', filters.transaction);
  }
  if (filters?.ville) {
    query = query.eq('ville', filters.ville);
  }
  if (filters?.commune) {
    query = query.eq('commune', filters.commune);
  }
  if (filters?.quartier) {
    query = query.eq('quartier', filters.quartier);
  }
  if (filters?.type_bien && filters.type_bien !== 'all') {
    query = query.eq('type_bien', filters.type_bien);
  }
  if (filters?.search) {
    query = query.or(`titre.ilike.%${filters.search}%,ville.ilike.%${filters.search}%,quartier.ilike.%${filters.search}%`);
  }

  const sort = filters?.sort || 'recent';
  if (sort === 'recent') {
    query = query.order('date_mise_a_jour', { ascending: false });
  } else if (sort === 'prix_asc') {
    query = query.order('prix', { ascending: true });
  } else if (sort === 'prix_desc') {
    query = query.order('prix', { ascending: false });
  } else if (sort === 'surface') {
    query = query.order('surface', { ascending: false });
  }

  const { data, error } = await query;
  if (error) console.error('Supabase fetchBiens error:', error);
  return data ?? [];
}

export async function fetchBienById(id: string) {
  const { data, error } = await supabase
    .from('biens')
    .select('*')
    .eq('id', id)
    .eq('statut', 'disponible')
    .single();
  if (error) console.error('Supabase fetchBienById error:', error);
  return data;
}

export async function fetchMediasByBienId(bienId: string) {
  const { data, error } = await supabase
    .from('medias')
    .select('*')
    .eq('bien_id', bienId);
  if (error) console.error('Supabase fetchMedias error:', error);
  return data ?? [];
}

export async function insertRadar(entry: {
  nom: string;
  telephone: string;
  email: string;
  ville: string;
  type_bien: string;
  transaction: string;
  description: string;
}) {
  const { data, error } = await supabase.from('radar').insert([entry]);
  if (error) throw error;
  return data;
}

export async function countBiensByVille() {
  const { data, error } = await supabase
    .from('biens')
    .select('ville, transaction')
    .eq('statut', 'disponible')
    .not('proprietaire_id', 'is', null);
  if (error) return {};
  const counts: Record<string, { total: number; vente: number; location: number }> = {};
  for (const b of data ?? []) {
    if (!counts[b.ville]) counts[b.ville] = { total: 0, vente: 0, location: 0 };
    counts[b.ville].total++;
    if (b.transaction === 'vente') counts[b.ville].vente++;
    if (b.transaction === 'location') counts[b.ville].location++;
  }
  return counts;
}
