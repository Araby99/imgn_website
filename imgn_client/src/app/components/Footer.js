"use client"
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default () => {
    const [social, setSocial] = useState();
    useEffect(() => {
        axios.get("/social").then(result => {
            setSocial(result.data)
        })
    }, [])
    return (
        <footer className="text-white w-screen flex gap-6 flex-col lg:py-8 text-center">
            <div className="text-center">
                <span className='text-[#8F4991] font-light text-2xl border-b border-[#8F4991]'>Encricle the World</span>
                <p className='text-[#8F4991] font-bold text-6xl mt-2'>Find Us</p>
            </div>
            <div className="flex gap-2 py-5 items-center justify-center">
                {
                    social?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer">
                            <div className="p-2 w-10 h-10 md:p-4 md:w-14 md:h-14 flex bg-white skew--20 duration-500 hover:bg-[#511752] footer-links">
                                <img src={item.icon} className="grow skew-20 duration-500" alt={item.name} />
                            </div>
                        </Link>
                    ))
                }
            </div>

            <div className="px-16" data-test="footer-text">
                Copyright &copy; {new Date().getFullYear()} IMGN - تخيل - All Rights Reserved
            </div>
        </footer>
    )
}
