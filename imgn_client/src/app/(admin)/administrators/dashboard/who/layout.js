import Sidebar from '@/app/components/Sidebar'
import React from 'react'

export default ({ children }) => {
    const links = [
        {
            name: "المتخليون",
            href: "who/BOD"
        },
        {
            name: "عن المنصة",
            href: "who/about"
        }
    ]
    return (
        <div className='flex flex-1 dir-rtl h-[100%]'>
            <div className="flex-[3]">
                <Sidebar links={links} />
            </div>
            <div className='flex-[20] p-10'>
                {children}
            </div>
        </div>
    )
}
