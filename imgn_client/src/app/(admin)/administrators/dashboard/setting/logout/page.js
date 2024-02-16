"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default () => {
    const router = useRouter();
    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
        router.push("/administrators/login")
    }, [])
    return <></>
}
