import axios from 'axios';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

export default () => {
    const [dropdown, setDropdown] = useState(false)
    const [open, setOpen] = useState(false)
    const menu = useRef(null)
    useEffect(() => {
        if (menu && menu.current) {

        }
    }, [menu])
    const [searchRes, setSearchRes] = useState()
    const [searchDiv, setSearchDiv] = useState(false)
    const timeRef = useRef(setTimeout(() => { }, 1))
    const path = usePathname().split("/")[1];
    const search = e => {
        clearTimeout(timeRef.current)
        timeRef.current = setTimeout(() => {
            if (e.target.value.trim() !== "") {
                axios.post(`/news/search/${e.target.value}`).then(res => {
                    setSearchDiv(true)
                    setSearchRes(res.data)
                })
            } else {
                setSearchDiv(false)
            }
        }, 1000);
    }
    const searchContainer = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainer.current && !searchContainer.current.contains(event.target)) {
                setSearchDiv(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainer])
    return (
        <nav className='relative'>
            <div className="nav-container flex flex-row-reverse text-white font-bold max-w-5xl mx-auto px-3 py-3 items-center justify-between h-16">
                <Link href="/" className="h-full">
                    <img className="h-full" src="/images/logo.png" alt="" />
                </Link>
                <div
                    id="mobile-menu"
                    className="fixed md:static flex flex-col-reverse justify-end md:flex-row-reverse gap-4 py-10 px-5 inset-y-0 right-0 z-20 w-64 md:w-auto bg-white md:bg-transparent translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out">
                    <button
                        id="close-menu-button"
                        className="absolute top-3 right-3 text-gray-500 hover:text-black focus:outline-none md:hidden"
                        aria-label="Close navigation menu">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <div className="flex flex-col-reverse md:flex-row">

                        <Link
                            href="/about-us"
                            className={`block px-4 py-2 my-1 text-black md:text-white text-right hover:bg-imgn-purple md:hover:bg-white hover:text-white md:hover:text-imgn-purple skew--20 ${path == "about-us" ? "nav-item-active" : ""}`}
                            id="about-us-nav"><p className='skew-20'>من نحن</p></Link>
                        <li onMouseOver={() => setDropdown(true)} onMouseOut={() => setDropdown(false)} className={`dropdownNavbarLink hover:text-imgn-purple block px-4 py-2 my-1 text-black md:text-white text-right hover:bg-imgn-purple md:hover:bg-white hover:text-white md:hover:text-imgn-purple skew--20 ${path == "media" ? "nav-item-active" : ""}`}>
                            <button data-dropdown-toggle="dropdownNavbar" className="skew-20 flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-900 rounded hover:text-imgn-purple md:p-0 md:w-auto dark:text-white dark:border-gray-700">وسائط</button>
                            <div className={`dropdownNavbar skew-20 z-10 ${!dropdown ? "hidden" : ""} font-normal bg-white divide-y divide-gray-100 shadow w-44`}>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                                    <li className="dropdown-items">
                                        <Link href="#" className="skew-20 font-bold text-xs block text-imgn-purple">فيديوهات</Link>
                                    </li>
                                    <li className="dropdown-items">
                                        <Link href="#" className="skew-20 font-bold text-xs block text-imgn-purple">صور</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <Link
                            href="/articles"
                            className={`block px-4 py-2 my-1 text-black md:text-white text-right hover:bg-imgn-purple md:hover:bg-white hover:text-white md:hover:text-imgn-purple skew--20 ${path == "articles" ? "nav-item-active" : ""}`}
                            id="articles-nav"><p className='skew-20'>مقالات</p></Link>
                        <Link
                            href="/news"
                            className={`block px-4 py-2 my-1 text-black md:text-white text-right hover:bg-imgn-purple md:hover:bg-white hover:text-white md:hover:text-imgn-purple skew--20 ${path == "news" ? "nav-item-active" : ""}`}
                            id="news-nav"><p className='skew-20'>اخبار</p></Link>
                    </div>
                </div>
                <form className="flex gap-5 items-center relative">
                    <button type="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            fill="#fff"
                            viewBox="0 0 512 512">
                            <path
                                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                            ></path></svg>
                    </button>
                    <input type="text" onInput={search} placeholder='...تخيل ما تريده' className="skew--20 nav-search p-2 text-right" />
                    {
                        searchDiv ? (
                            <div ref={searchContainer} className="absolute overflow-hidden w-[350px] text-black text-right top-[150%] z-[1000] shadow-2xl left-[50%] translate-x-[-50%] bg-white rounded p-5">
                                {
                                    searchRes.length ? (
                                        <>
                                            <p className="mb-5 font-bold text-imgn-purple text-xl">الأخبار</p>
                                            {searchRes.map((s, i) => (
                                                <Link href={`/news/${s._id}`} className="flex justify-between items-center" key={i}>
                                                    <img src={s.hero} alt={s.title} className='h-[50px] object-cover aspect-circle rounded' />
                                                    <p>{s.title}</p>
                                                </Link>
                                            ))}
                                        </>
                                    ) : (
                                        <p className='text-center text-imgn-purple'>لا توجد أخبار بهذا الإسم</p>
                                    )
                                }
                            </div>
                        ) : <></>
                    }
                </form>
                <button
                    id="mobile-menu-button"
                    onClick={() => setOpen(o => !o)}
                    className="block text-white hover:text-gray-400 focus:outline-none focus:text-gray-400 md:hidden"
                    aria-label="Toggle navigation menu">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
            <div ref={menu} className={`${!open && "scale-y-0"} shadow-2xl absolute top-100 z-50 w-full origin-top duration-500 p-5 overflow-hidden flex flex-col gap-5 bg-white text-right text-bold text-imgn-purple font-bold`}>
                <Link href="/news">اخبار</Link>
                <Link href="/articles">المقالات</Link>
                <Link href="/media">وسائط</Link>
                <Link href="/about-us">من نحن</Link>
            </div>
        </nav>
    )
}
