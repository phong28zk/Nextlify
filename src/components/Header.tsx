"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';

import Button from '@/components/Button';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import useAuthModal from '@/hooks/useAuthModal';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';


interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
    const authModal = useAuthModal();
    const router = useRouter();

    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        router.refresh();

        if(error) {
            toast.error(error.message);
        }
        else {
            toast.success('Logged out successfully');
        }

    }

    return (
        <div className={twMerge(`h-fit bg-gradient-to-b from-emerald-800 p-6`, className)}>
            <div className='w-full mb-4 flex items-center justify-between'>
                <div className='hidden md:flex gap-x-2 items-center'>
                    <button
                        onClick={() => router.back()}
                        className='rounded-full bg-black hover:bg-emerald-800 flex items-center justify-center hover:opacity-75'>
                        <ChevronLeft className='text-white'/>
                    </button>
                    <button
                        onClick={() => router.forward()}  
                        className='rounded-full bg-black hover:bg-emerald-800 flex items-center justify-center hover:opacity-75'>
                        <ChevronRight className='text-white'/>
                    </button>
                </div>
                <div className='flex md:hidden gap-x-2 items-center'>
                    <button className='rounded-full p-2 bg-white items-center flex justify-center hover:bg-emerald-800 hover:placeholder-opacity-60'>
                        <HiHome className='text-black' size={20}/>
                    </button>
                    <button className='rounded-full p-2 bg-white items-center flex justify-center hover:bg-emerald-800 hover:placeholder-opacity-60'>
                        <BiSearch className='text-black' size={20}/>
                    </button>
                </div>
                <div className='flex items-center justify-between gap-x-4'>
                    { user ? (
                        <div className='flex gap-x-4 items-center'>
                            <Button
                                onClick = {handleLogout}
                                className='bg-white px-6 py-2'
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={() => router.push('/account')}
                                className='bg-white'
                            >
                                <FaUserAlt/>
                            </Button>
                        </div>
                    ) : (
                    <>
                        <div className='flex gap-x-4'>
                            <Button
                                onClick = {(authModal.onOpen)}
                                className='bg-transparent text-neutral-300 px-6 py-2 border border-neutral-300 rounded-full'
                            >
                                Signup
                            </Button>
                            <Button
                                onClick = {(authModal.onOpen)}
                                className='bg-white px-6 py-2'
                            >
                                Log in
                            </Button>
                        </div>
                    </>
                    )}
                </div> 
            </div>
            {children}
        </div>
    );
}

export default Header