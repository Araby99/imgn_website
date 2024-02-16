import { useRouter } from 'next/router'
import React from 'react'

const AuthAdmin = () => {
    const router = useRouter();
    if (typeof window !== "undefined") {
        if (window.location.hostname.split(".")[0] !== "admin") {
            router.push("/404")
        }
    }
    return <></>
}

export default AuthAdmin