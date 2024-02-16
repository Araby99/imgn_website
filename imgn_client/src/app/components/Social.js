"use client"
import axios from 'axios'
import React, { useRef, useState } from 'react'

export default ({ changeData, _id, name, link, icon }) => {
    const [socialName, setSocialName] = useState(name)
    const [editName, setEditName] = useState(false)
    const saveName = e => {
        if (e.keyCode == 13) {
            setSocialName(e.target.value)
            setEditName(false)
            changeData(_id, "name", e.target.value)
        }
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
    const uploadAvatar = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
        axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(image => {
            changeData(_id, link, image.data.secure_url)
        })
    }
    return (
        <div className="flex items-center gap-10">
            <div>
                <div>
                    {editName ? (
                        <input className='border' type="text" defaultValue={socialName} onKeyUp={saveName} />
                    ) : (
                        <p onClick={() => setEditName(true)} className='text-[#511752] font-bold text-xl'>{socialName}</p>
                    )}
                </div>
                <div className="flex items-center gap-5 mt-3">
                    <input className='bg-[#E8E6FF] py-2 px-4 rounded-full w-[500px]' type="text" defaultValue={link} onChange={e => changeData(_id, link, e.target.value)} />
                    <img className='h-10' ref={avatar} src={icon} alt={name} />
                    <input type="file" accept='image/*' onChange={e => { changeAvatar(e); uploadAvatar() }} />
                </div>
            </div>
        </div>
    )
}
