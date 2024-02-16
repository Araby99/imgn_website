"use client"
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Puff } from 'react-loader-spinner';
import Swal from 'sweetalert2';

export default () => {
    const path = usePathname();
    const [news, setNews] = useState();
    const [loading, setLoading] = useState(false)
    const getData = (link, filters) => {
        setLoading(true)
        axios.post(link, filters).then(result => {
            setLoading(false)
            setNews(result.data)
        })
    }
    useEffect(() => getData("/news", {}), [])
    const filter = e => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const _id = e.target._id.value.trim();
        const date = e.target.date.value;
        let filters = {};
        if (name) filters.name = name
        if (_id) filters._id = _id
        if (date) filters.createdAt = date
        getData("/news", filters)
    }
    const deleteNews = id => {
        Swal.fire({
            title: 'هل أنت متأكد من حذف الخبر ؟',
            text: "لن تستطيع إستعادة الخبر بعد حذفه !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#511752',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، متأكد',
            cancelButtonText: 'لا، إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/news/${id}`).then(() => {
                    getData("/news", {})
                    Swal.fire({
                        title: "تم الحذف !",
                        confirmButtonText: "تم"
                    })
                })
            }
        })
    }
    return (
        <div className='flex flex-col gap-7'>
            <form className='flex flex-col gap-7' onSubmit={filter}>
                <p className='font-bold text-[#511752] text-2xl'>البحث عن خبر سابق</p>
                <input type="text" name='name' className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' />
                <p className='font-bold text-[#511752] text-2xl'>البحث بالكود</p>
                <input type="text" name='_id' className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' />
                <p className='font-bold text-[#511752] text-2xl'>البحث بالتاريخ</p>
                <input type="date" name='date' className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' />
                <button type='submit' className='flex justify-center p-3 w-[200px] text-xl rounded-full bg-[#E8E6FF]'>
                    {
                        loading ? (
                            <Puff
                                height="30"
                                width="30"
                                radius={1}
                                color="#511752"
                                ariaLabel="puff-loading"
                            />
                        ) : "بحث"
                    }
                </button>
            </form>
            <p className='font-bold text-[#511752] text-2xl'>قائمة الأخبار السابقة</p>
            <table className='rounded-[15px] bg-[#E8E6FF]'>
                <tbody className='p-5'>
                    <tr>
                        <td>م</td>
                        <td>كود</td>
                        <td>عنوان المقال</td>
                        <td>تاريخ النشر</td>
                        <td>التعديل</td>
                    </tr>
                    {
                        news?.data.map((n, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{n._id}</td>
                                <td>{n.title}</td>
                                <td>{new Date(n.createdAt).toLocaleDateString()} - {new Date(n.createdAt).getHours()}:{new Date(n.createdAt).getMinutes()}</td>
                                <td>
                                    <div className="flex gap-2 justify-between items-center">
                                        <Link href={`/news/${n._id}`} target='_blank'>
                                            <img className='h-5' src="/images/eye.png" alt="eye" />
                                        </Link>
                                        <Link href={`${path.split("/").slice(0, -1).join("/")}/edit/${n._id}`} target='_blank'>
                                            <img className='h-5' src="/images/edit.png" alt="edit" />
                                        </Link>
                                        <button onClick={() => deleteNews(n._id)}>
                                            <img className='h-5' src="/images/delete.png" alt="delete" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                news?.total > news?.perPage && (
                    <div className="pagination text-3xl mx-auto flex item-center justify-center gap-10">
                        <p className={news.links[1].url ? "active" : ""} onClick={() => news.links[1].url && getData(news.links[1].url)}>&lt;</p>
                        {
                            news.links.filter(link => link.label).map((link, index) => (
                                <p key={index} className={link.active ? "active" : ""} onClick={() => getData(link.url)}>{link.label}</p>
                            ))
                        }
                        <p className={news.links[0].url ? "active" : ""} onClick={() => news.links[0].url && getData(news.links[0].url)}>&gt;</p>
                    </div>
                )
            }
        </div>
    )
}
