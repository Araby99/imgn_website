"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { Puff } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default () => {
    const { id } = useParams();
    const [member, setMember] = useState([]);
    const [loading, setLoading] = useState(false);
    const avatar = useRef(null);
    const changeAvatar = e => {
        if (e.target.files[0]) {
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    useEffect(() => {
        axios.get(`/BOD/${id}`).then(res => {
            setMember(res.data)
        }).catch(err => {
            if (err.response.status) {
                router.push("/404")
            }
        })
    }, [])
    const submit = e => {
        e.preventDefault();
        setLoading(true)
        if (e.target.image.files[0]) {
            const formData = new FormData();
            formData.append("file", e.target.image.files[0]);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_NEWS);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
            axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(res => {
                const name = e.target.name.value;
                const position = e.target.position.value;
                const rank = e.target.rank.value;
                const image = res.data.secure_url;
                axios.put(`/BOD/${id}`, { name, position, rank, image }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(() => {
                    setLoading(false);
                    toast.success('تمت تحديث المتخيل بنجاح !', {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
            })
        } else {
            const name = e.target.name.value;
            const position = e.target.position.value;
            const rank = e.target.rank.value;
            axios.put(`/BOD/${id}`, { name, position, rank }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(() => {
                setLoading(false);
                toast.success('تمت تحديث المتخيل بنجاح !', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        }
    }
    return (
        <>
            <form className='flex flex-col gap-5' onSubmit={submit}>
                <p className='text-xl text-[#511752] font-bold'>إسم المتخيل</p>
                <input type="text" defaultValue={member?.name} required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='name' />
                <p className='text-xl text-[#511752] font-bold'>وظيفته</p>
                <input type="text" defaultValue={member?.position} required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='position' />
                <p className='text-xl text-[#511752] font-bold'>الترتيب</p>
                <input type="number" defaultValue={member?.rank} required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='rank' />
                <p className='text-xl text-[#511752] font-bold'>إضافة صورة</p>
                <div className='flex gap-5 items-center'>
                    <input type="file" name='image' accept='image/*' onChange={e => changeAvatar(e)} />
                    <img className='h-20' src={member?.image} ref={avatar} alt='cover' />
                </div>
                <button type='submit' disabled={loading} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]'>
                    {loading ? (
                        <Puff
                            height="30"
                            width="30"
                            radius={1}
                            color="#511752"
                            ariaLabel="puff-loading"
                        />
                    ) : "حفظ التعديلات"}
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
