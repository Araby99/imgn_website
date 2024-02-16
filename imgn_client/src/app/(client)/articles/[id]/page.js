"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default ({ params }) => {
    const { id } = params
    const [articles, setArticles] = useState();
    useEffect(() => {
        if (id) {
            axios.get(`/articles/${id}`).then(result => {
                setArticles(result.data)
            })
        }
    }, [id])
    if (!articles) {
        return (
            <p>spinner</p>
        )
    }
    return (
        <>
            <div className='text-right container mx-auto py-20 text-white'>
                <p className="font-bold text-3xl">{articles.title}</p>
                <div className="w-full py-10">
                    <img src={articles.hero} alt={articles.title} className='w-full h-1/2 object-contain' />
                </div>
                <p className="description">{articles.description}</p>
            </div>
        </>
    )
}
