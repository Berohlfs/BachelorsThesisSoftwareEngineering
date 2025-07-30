'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"

export const getMyEvents = async (organizer_id: string, search: string) => {

    if (search.length === 0) {
        return []
    }

    const supabase = await createClient()

    const { data } = await supabase
        .from('events')
        .select()
        .eq('organizer_id', organizer_id)
        .ilike('name', `%${search}%`)
        .limit(3)

    if (!data) {
        return `Erro ao buscar seus eventos`
    } else {
        return data
    }
}