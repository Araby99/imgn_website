"use client"
import MemberInfo from '@/app/components/MemberInfo';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Puff } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Member = () => {
    const avatar = useRef(null);
    const changeAvatar = e => {
        if (e.target.files[0]) {
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    return (
        <>
            <p className='text-xl text-[#511752] font-bold'>إسم المتخيل</p>
            <input type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='name' />
            <p className='text-xl text-[#511752] font-bold'>وظيفته</p>
            <input type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='position' />
            <p className='text-xl text-[#511752] font-bold'>الترتيب</p>
            <input type="number" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='rank' />
            <p className='text-xl text-[#511752] font-bold'>إضافة صورة</p>
            <div className='flex gap-5 items-center'>
                <input type="file" name='image' required accept='image/*' onChange={e => changeAvatar(e)} />
                <img className='h-20' ref={avatar} alt='cover' />
            </div>
            <hr />
        </>
    )
}

export default () => {
    const [loading, setLoading] = useState(false)
    const [components, setComponents] = useState([<Member />]);
    const [members, setMembers] = useState([]);
    useEffect(() => {
        axios.get("/BOD").then((res) => {
            setMembers(res.data)
        })
    }, [])
    const cloneComponent = () => {
        setComponents(prevComponents => [...prevComponents, <Member />]);
    }
    const submit = e => {
        e.preventDefault();
        setLoading(true)
        let newMembers = [];
        let images = [];
        let endpoints = [];
        if (components.length > 1) {
            for (let i = 0; i < components.length; i++) {
                const formData = new FormData();
                formData.append("file", e.target.image[i].files[0]);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_NEWS);
                formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
                images.push(formData);
                endpoints.push(process.env.NEXT_PUBLIC_CLOUD);
            }
            axios.all(endpoints.map((endpoint, i) => axios.post(endpoint, images[i]))).then(
                (data) => {
                    data.forEach((mem, i) => {
                        const member = {
                            name: e.target.name[i].value,
                            position: e.target.position[i].value,
                            rank: Number(e.target.rank[i].value),
                            image: mem.data.secure_url
                        }
                        newMembers.push(member);
                    })
                    axios.post("/BOD/create", newMembers, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(
                        (results) => {
                            setLoading(false);
                            toast.success('تمت إضافة الأعضاء بنجاح !', {
                                position: "bottom-left",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    )
                },
            );
        } else {
            const formData = new FormData();
            formData.append("file", e.target.image.files[0]);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_NEWS);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
            axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(image => {
                const member = {
                    name: e.target.name.value,
                    position: e.target.position.value,
                    rank: Number(e.target.rank.value),
                    image: image.data.secure_url
                }
                axios.post("/BOD/create", member, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(
                    (results) => {
                        setLoading(false);
                        toast.success('تمت إضافة الأعضاء بنجاح !', {
                            position: "bottom-left",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                )
            })
        }
    }
    const deleteMember = id => {
        axios.delete(`/BOD/${id}`).then(() => {
            setMembers(member => member.filter(m => m._id !== id));
            toast.success('تمت حذف العضو بنجاح !', {
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
    return (
        <>
            <div className="grid grid-cols-2 mb-3 gap-5">
                {members?.map(m => <MemberInfo deleteMember={deleteMember} key={m._id} name={m.name} id={m._id} image={m.image} position={m.position} />)}
            </div>
            <form className='flex flex-col gap-5' onSubmit={submit}>
                {components.map((component, index) => (
                    <React.Fragment key={index}>
                        {component}
                    </React.Fragment>
                ))}
                <button onClick={cloneComponent} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]'>إضافة عضو آخر</button>
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
