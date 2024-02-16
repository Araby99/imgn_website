"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { decodeToken, isExpired } from 'react-jwt'
import { Puff } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


export default () => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const router = useRouter();
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
    const update = e => {
        e.preventDefault();
        setLoading(true)
        const username = e.target.username.value;
        const oldPass = e.target.oldPass.value;
        const newPass = e.target.newPass.value;
        let data = {};
        if (username) data.username = username
        if (oldPass) data.oldPass = oldPass
        if (newPass) data.newPass = newPass
        axios.put(`/admin/update/${user.id}`, data).then(() => {
            setLoading(false)
            toast.success('تمت تعديل الحساب بنجاح !', {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            localStorage.clear();
            sessionStorage.clear();
            setTimeout(() => router.push("/administrators/login"), 2000)
        }).catch(err => {
            setLoading(false)
            const { status } = err.response;
            if (status == 401) {
                toast.error('كلمة المرور خاطئة !', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else if (status == 409) {
                toast.error('إسم المستخدم مأخوذ بالفعل', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                console.log(err);
            }
        })
    }
    return (
        <>
            <form onSubmit={update} className='flex flex-col gap-5'>
                <p className='text-xl text-[#511752] font-bold'>إسم المستخدم</p>
                <input defaultValue={user?.username} type="text" className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='username' />
                <p className='text-xl text-[#511752] font-bold'>تغيير كلمة المرور</p>
                <input type="text" className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='oldPass' placeholder='كلمة المرور القديمة' />
                <input type="text" className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='newPass' placeholder='كلمة المرور الجديدة' />
                <button type='submit' disabled={loading} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]'>
                    {loading ? (
                        <Puff
                            height="30"
                            width="30"
                            radius={1}
                            color="#511752"
                            ariaLabel="puff-loading"
                        />
                    ) : "تعديل  البيانات"}
                </button>
            </form>
            <ToastContainer
                position="bottom-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
