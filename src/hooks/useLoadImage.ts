import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Song } from "../types";

const useLoadImage =  (songs: Song) => {
    const supabaseClient = useSupabaseClient();

    if(!songs) return null;
    const { data } = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(songs.image_path);

    return data.publicUrl;
};

export default useLoadImage;