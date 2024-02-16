"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import 'swiper/css';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import Link from 'next/link';

export default ({ params }) => {
    const { id } = params;
    const [news, setNews] = useState();
    const [related, setRelated] = useState([])
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 3
        },
        desktop: {
            breakpoint: { max: 3000, min: 1500 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1500, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    useEffect(() => {
        if (id) {
            axios.get(`/news/${id}`).then(result => {
                setNews(result.data)
                let relatedArr = [];
                for (let i = 0; i < result.data.related.length; i++) {
                    relatedArr.push(axios.get(`/news/${result.data.related[i]}`))
                }
                relatedArr.length && axios.all(relatedArr).then(axios.spread((...result) => {
                    result.forEach(r => {
                        setRelated(related => [...related, r.data].filter((value, index, self) =>
                            index === self.findIndex((t) => (
                                t._id === value._id
                            ))
                        ))
                    })
                }))
            })
        }
    }, [id])
    if (!news) {
        return (
            <p>spinner</p>
        )
    }
    return (
        <>
            <div className='text-right container mx-auto py-20 text-white w-[90%] md:w-[70%]'>
                <p className="font-bold text-3xl pb-3">{news.title}</p>
                <p className="text-2xl">{news.subTitle}</p>
                <div className="w-[95%] md:w-[50%] m-auto py-10">
                    <img src={news.hero} alt={news.title} className='w-full h-1/2 object-contain' />
                </div>
                <div className='leading-9 text-xl' dangerouslySetInnerHTML={{ __html: news.description }} />
                {news.tags.length ? (
                    <div className='my-10'>
                        <p className="text-3xl underline">العلامات</p>
                        <div className="flex gap-5 p-5 flex-row-reverse">
                            {news.tags.map((tag, index) => (
                                <Link href={`/tags/${tag.tag}`} className="rounded-full font-bold py-2 px-3 bg-imgn-purple hover:bg-transparent duration-500" key={index}>
                                    {tag.tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : <></>}
                <hr className='mt-10' />
                {related.length ? (
                    <>
                        <p className="my-10 text-white font-bold text-center text-shadow text-4xl">الأخبار المرتبطة</p>
                        <Carousel responsive={responsive}
                            infinite={true}
                            autoPlaySpeed={5000}
                            pauseOnHover={true}
                            arrows={false}
                            className='item-carousel'
                        // autoPlay={true}
                        >
                            {related.map((r, i) => (
                                <Link href={`/news/${r?._id}`} key={i} className='m-10 flex justify-center'>
                                    <div className="skew-x-[-10deg] overflow-hidden w-[100%]">
                                        <div className="relative">
                                            <div style={{ backgroundImage: `url(${r?.hero})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} className="md:absolute top-0 left-0 h-full w-[190%] left-[-20%] md:skew-x-10"></div>
                                            <img src={r?.hero} alt={r?.title} className='md:opacity-0 h-full object-cover' draggable={false} />
                                        </div>
                                        <div className="skew-x-[10deg] absolute bottom-[0] translate-x-[-10%] w-[120%] bg-gradient-to-t from-slate-950 from-80% p-5 text-center">
                                            <p>{r.title}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </Carousel>
                    </>
                ) : <></>}
            </div>
        </>
    )
}
