"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import useAuthModal from '@/hooks/useAuthModal';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { error } from 'console';
import { toast } from 'react-hot-toast';


interface LikeButtonProps {
    songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
    
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if(!user?.id) { 
            return;
        }

        const fetchData = async () => { 
            const { data, error } = await supabaseClient
                .from('liked_songs')
                .select('*')
                .eq('user_id', user.id)
                .eq('song_id', songId)
                .single();

            if(!error && data) {
                setIsLiked(true);
            }
            
        };

        fetchData();

    }, [songId, supabaseClient, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if(!user) {
            return authModal.onOpen();
        }

        if(isLiked) {
            const { error } = await supabaseClient
            .from('liked_songs')
            .delete()
            .eq('user_id', user.id)
            .eq('song_id', songId);
            if(error) {
                toast.error('Error liking song');
            }
            else {
                setIsLiked(!isLiked);
            }
        } else {
            const { error } = await supabaseClient
            .from('liked_songs')
            .insert([{ user_id: user.id, song_id: songId }]);

            if(error) {
                toast.error('Error liking song');
            }
            else {
                setIsLiked(!isLiked);
                toast.success('Song liked');
            }
        }
    
        router.refresh();

    }

    return (
        <button onClick = {handleLike}>
            <Icon color={isLiked ? '#22c55e' : 'white'} size={25}/>
        </button>
    )
}

export default LikeButton