"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default () => {
    const [members, setMembers] = useState([]);
    const [about, setAbout] = useState("");
    useEffect(() => {
        const endpoints = ["/BOD", "/about"];
        axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
            (data) => {
                setMembers(data[0].data);
                setAbout(data[1].data);
            },
        );
    }, [])
    return (
        <>
            <main>
                <div className="container mx-auto">
                    <div
                        className="skew-x-n20 flex min-h-[20vh] md:min-h-[20vh] mx-10 my-16 md:mx-30 md:my-30 gap-8 bg-white text-black"
                    >
                        <div className='w-full'>
                            <h1 className="text-imgn-purple skew-x-20 m-4 md:m-8 text-3xl md:text-4xl font-bold text-center">
                                تخيل | IMGN
                            </h1>
                            <div className='p-5' dangerouslySetInnerHTML={{ __html: about?.about }} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
