import Link from 'next/link'
import React, { useState } from 'react'
import { Puff } from 'react-loader-spinner';

const MemberInfo = ({ id, image, name, position, deleteMember }) => {
    const [loading, setLoading] = useState(false);
    return (
        <div className='border-solid border-2 rounded-lg p-5 flex justify-between items-center'>
            <div className="flex items-center gap-3">
                <img src={image} alt={name} className='h-[70px] w-[70px] rounded-full object-cover' />
                <div className="flex flex-col gap-2">
                    <span className='font-bold text-xl text-imgn-purple'>{name}</span>
                    <span className='font-semibold text-imgn-purple'>{position}</span>
                </div>
            </div>
            <div className="flex gap-2">
                <Link href={`BOD/edit/${id}`}>
                    <button className='p-2 rounded-lg bg-green-500 border-solid border-2 border-green-500 text-white font-medium duration-500 hover:bg-transparent hover:text-green-500'>تعديل</button>
                </Link>
                <button onClick={() => { deleteMember(id); setLoading(true) }} className='p-2 rounded-lg bg-red-500 border-solid border-2 border-red-500 text-white font-medium duration-500 hover:bg-transparent hover:text-red-500'>
                    {loading ? (
                        <Puff
                            height="25"
                            width="25"
                            radius={1}
                            color="#f00"
                            ariaLabel="puff-loading"
                        />
                    ) : "حذف"}
                </button>
            </div>
        </div>
    )
}

export default MemberInfo