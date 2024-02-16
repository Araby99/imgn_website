"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        router.push(`dashboard/home`)
    }, [pathname])
    useEffect(() => {
    }, [])
    return (
        <></>
    )
}
