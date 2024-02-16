"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default ({ links }) => {
    const path = usePathname().split("/dashboard/")[1].split("/")[1];
    return (
        <div className="w-[100%] h-[100%] flex flex-col bg-[#321135] pt-3">
            {links.map((link, index) => (
                <Link href={`${usePathname().split("/dashboard/")[0]}/dashboard/${link.href}`} key={index} className={`py-4 duration-300 text-xl font-bold text-center hover:bg-white hover:text-[#321135] ${path == link.href.split("/")[1] ? "bg-white text-[#321135]" : "text-white"}`}>
                    {link.name}
                </Link>
            ))}
        </div>
    )
}
