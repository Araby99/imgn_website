"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Puff } from 'react-loader-spinner';
import { isExpired } from 'react-jwt'

export default () => {
    const router = useRouter();
    useEffect(() => {
        const tknLS = localStorage.getItem("token");
        if (tknLS) {
            const tokenExpired = isExpired(tknLS);
            if (!tokenExpired) {
                router.push("/administrators/dashboard");
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
            }
        } else {
            const tknSS = sessionStorage.getItem("token");
            if (tknSS) {
                const tokenExpired = isExpired(tknSS);
                if (!tokenExpired) {
                    router.push("/administrators/dashboard");
                } else {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("admin");
                }
            }
        }
    }, [])
    const [userErr, setUserErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);
    const login = e => {
        e.preventDefault();
        setSubmitLoader(true);
        const username = e.target.username.value;
        const password = e.target.password.value;
        const isStorage = e.target.save.checked;
        axios.post("/admin/login", { username, password }).then(result => {
            if (isStorage) {
                localStorage.setItem("token", result.data)
            } else {
                sessionStorage.setItem("token", result.data)
            }
            router.push("/administrators/dashboard")
            setSubmitLoader(false);
        }).catch(err => {
            if (err.response.status == 401) {
                setPassErr(true);
            } else if (err.response.status == 404) {
                setUserErr(true);
            }
            setSubmitLoader(false);
        })
    }
    return (
        <div className='login flex justify-center items-center'>
            <div className="login-container relative py-[150px] text-[#511752] gap-[20px] rounded-[20px] z-[1] bg-white flex items-center flex-col">
                <img src="/images/logo-dark.png" alt="IMGN" className='w-4/12' />
                <form className='flex gap-[20px] flex-col' onSubmit={login}>
                    <div className="flex items-center py-3 px-5 w-[300px] rounded-full gap-3 bg-[#E8E6FF]">
                        <img src="/images/user.png" className='h-[20px] aspect-square' alt="مستخدم" />
                        <input required={true} onInput={() => setUserErr(false)} type="text" name='username' className='bg-[transparent] outline-none w-full' placeholder='Username' />
                    </div>
                    <p className={`text-[#f00] ${userErr ? "block" : "hidden"}`}>* Account is not exist</p>
                    <div className="flex items-center py-3 px-5 w-[300px] rounded-full gap-3 bg-[#E8E6FF]">
                        <img src="/images/lock.png" className='h-[20px] aspect-square' alt="ٌقفل" />
                        <input required={true} onInput={() => setPassErr(false)} type="text" name='password' className='bg-[transparent] outline-none w-full' placeholder='Password' />
                    </div>
                    <p className={`text-[#f00] ${passErr ? "block" : "hidden"}`}>* Password is wrong</p>
                    <div className="flex gap-3">
                        <input type="checkbox" name='save' id='save' className='scale-[1.2]' />
                        <label htmlFor="save">حفظ البيانات</label>
                    </div>
                    <div className="flex justify-center">
                        <button className='bg-gradient-to-t from-[#511752] to-[#71c8df] rounded-full text-white px-10 py-3 cursor-pointer font-bold' type='submit'>
                            {!submitLoader ? "تسجيل الدخول" : (
                                <Puff
                                    height="30"
                                    width="30"
                                    radius={1}
                                    color="#fff"
                                    ariaLabel="puff-loading"
                                />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
