"use client"
import Drag from '@/app/components/Drag';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

export default () => {
    const [social, setSocial] = useState();
    useEffect(() => {
        axios.get("/social").then(result => {
            setSocial(result.data)
        })
    }, [])
    const add = () => {
        let clone = social;
        clone.push({
            name: "منصة جديدة",
            link: "https://",
            icon: ""
        })
        setSocial(clone)
    }
    console.log(social);
    const changeData = (id, type, data) => {
        let obj = [...social];
        obj.find(o => {
            if (o._id == id) {
                o[type] = data
            }
        })
        setSocial(obj)
    }
    const [file, setFile] = useState();
    const avatar = useRef();
    const changeAvatar = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    const submit = e => {
        e.preventDefault();
        axios.post("/social", social, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } })
            .then(() => {
                toast.success('تم تحديث روابط المنصات !', {
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
            .catch(err => {
                toast.error('حدث خطأ، يمكنك معرفة المزيد من الconsole', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log(err)
            })
    }
    return (
        <>
            {social && <Drag changeData={changeData} social={social} setSocial={setSocial} />}
            <button onClick={add} className="mt-10 flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]">أضف منصة</button>
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
