"use client";
import Card from '../../components/Card';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default () => {
    const [articles, setArticles] = useState();
    const getData = link => {
        axios.post(link, {}).then(result => {
            setArticles(result.data)
        })
    }
    useEffect(() => getData("/articles"), [])
    return (
        <>
            <main>
                <article className="max-w-6xl mx-auto px-3">
                    <section
                        className="dir-rtl grid grid-cols-1 mx-10 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8"
                        data-test="articles-section">
                        {
                            articles?.data.map((item, index) => (
                                <div key={index} className="col-span-1">
                                    <Card {...item} type="articles" />
                                </div>
                            ))
                        }
                    </section>
                    {
                        articles?.total > articles?.perPage && (
                            <div className="pagination text-3xl text-white mx-auto flex item-center justify-center gap-10">
                                <p className={articles.links[1].url ? "active" : ""} onClick={() => articles.links[1].url && getData(articles.links[1].url)}>&lt;</p>
                                {
                                    articles.links.filter(link => link.label).map((link, index) => (
                                        <p key={index} className={link.active ? "active" : ""} onClick={() => getData(link.url)}>{link.label}</p>
                                    ))
                                }
                                <p className={articles.links[0].url ? "active" : ""} onClick={() => articles.links[0].url && getData(articles.links[0].url)}>&gt;</p>
                            </div>
                        )
                    }
                </article>
            </main>
        </>
    )
}
