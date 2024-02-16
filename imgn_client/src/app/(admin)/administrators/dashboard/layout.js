"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { decodeToken, isExpired } from 'react-jwt'

export default ({ children }) => {
    const [user, setUser] = useState()
    const [path, setPath] = useState()
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (typeof pathname.split("/dashboard/")[1] == "string") {
            setPath(pathname.split("/dashboard/")[1].split("/")[0])
        }
    }, [pathname])
    useEffect(() => {
        const tknLS = localStorage.getItem("token");
        if (tknLS) {
            const tokenExpired = isExpired(tknLS);
            if (!tokenExpired) {
                const admin = decodeToken(tknLS);
                setUser(admin);
                localStorage.setItem("admin", JSON.stringify(admin));
            } else {
                localStorage.removeItem("token")
                localStorage.removeItem("admin")
                router.push("/administrators/login")
            }
        } else {
            const tknSS = sessionStorage.getItem("token");
            const tokenExpired = isExpired(tknSS);
            if (!tokenExpired) {
                const admin = decodeToken(tknSS);
                setUser(admin);
                sessionStorage.setItem("admin", JSON.stringify(admin));
            } else {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("admin")
                router.push("/administrators/login")
            }
        }
    }, [])
    return (
        <div className='flex flex-col min-h-[100vh]'>
            <nav className='dir-rtl flex items-center bg-[#511752] text-white'>
                <div className="w-[15%] flex justify-center items-center gap-5 p-5">
                    <Link href={`${usePathname().split("/dashboard/")[0]}/dashboard/setting`}>
                        <img src="/images/white-setting.png" className='h-8 object-contain' alt="اعدادات" />
                    </Link>
                    <span className='font-bold text-[1.2rem]'>{user?.username}</span>
                </div>
                <div className="w-full flex justify-end">
                    <Link className={`p-6 hover:text-[#511752] hover:bg-white font-bold text-xl duration-300 ${path == "home" ? "text-[#511752] bg-white" : ""}`} href={`${usePathname().split("/dashboard/")[0]}/dashboard/home`}>
                        الصفحة الرئيسية
                    </Link>
                    <Link className={`p-6 hover:text-[#511752] hover:bg-white font-bold text-xl duration-300 ${path == "news" ? "text-[#511752] bg-white" : ""}`} href={`${usePathname().split("/dashboard/")[0]}/dashboard/news`}>
                        الأخبار
                    </Link>
                    <Link className={`p-6 hover:text-[#511752] hover:bg-white font-bold text-xl duration-300 ${path == "articles" ? "text-[#511752] bg-white" : ""}`} href={`${usePathname().split("/dashboard/")[0]}/dashboard/articles`}>
                        المقالات
                    </Link>
                    <Link className={`p-6 hover:text-[#511752] hover:bg-white font-bold text-xl duration-300 ${path == "media" ? "text-[#511752] bg-white" : ""}`} href={`${usePathname().split("/dashboard/")[0]}/dashboard/media`}>
                        وسائط
                    </Link>
                    <Link className={`p-6 hover:text-[#511752] hover:bg-white font-bold text-xl duration-300 ${path == "who" ? "text-[#511752] bg-white" : ""}`} href={`${usePathname().split("/dashboard/")[0]}/dashboard/who`}>
                        من نحن
                    </Link>
                </div>
            </nav>
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    )
}
