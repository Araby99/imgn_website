"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        router.push(`/administrators/login`)
    }, [pathname])
    useEffect(() => {
    }, [])
    return (
        <></>
    )
}