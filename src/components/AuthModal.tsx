"use client"

import React, { useEffect } from 'react';
import { useRouter } from  'next/navigation';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import Modal from './Modal';
import useAuthModal from '@/hooks/useAuthModal';

const AuthModal = () => {
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useAuthModal();
    
    const supabaseClient = useSupabaseClient();

    const onChange = (open: boolean) => {
        if(!open) onClose();
    }

    useEffect(() => {
        if(session) {
            router.refresh();   
            onClose();
        }
    }, [session, router, onClose])

    return (
        <Modal 
            title="Welcome back" 
            description="Login" 
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                theme='dark'
                providers={["github", "google"]}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa,
                    variables:{
                        default:{
                            colors: {
                                brandButtonText: 'white',
                                defaultButtonBackground: '#1e1e1e',
                                defaultButtonBackgroundHover: '#2e2e2e',
                                //..
                              },
                        }
                    }
                }}
            />
        </Modal>
    )
}

export default AuthModal;