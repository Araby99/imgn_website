"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card from '../../components/Card';

export default () => {
    const [news, setNews] = useState();
    const getData = link => {
        axios.post(link, {}).then(result => {
            setNews(result.data)
        })
    }
    useEffect(() => getData("/news"), [])
    return (
        <>
            <main>
                <article className="max-w-6xl mx-auto px-3">
                    <section
                        className="dir-rtl grid grid-cols-1 mx-10 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8"
                        data-test="news-section">
                        {
                            news?.data.map((item, index) => (
                                <div key={index} className="col-span-1">
                                    <Card {...item} type="news" />
                                </div>
                            ))
                        }
                    </section>
                    {
                        news?.total > news?.perPage && (
                            <div className="pagination text-3xl text-white mx-auto flex item-center justify-center gap-10">
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
                </article>
            </main>
        </>
    )
}
