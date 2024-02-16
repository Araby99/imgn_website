"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CarouselItem from './CarouselItem'

export default ({ sectionName }) => {
    const [section, setSection] = useState([])
    useEffect(() => {
        axios.get(`/${sectionName}/getLastThree`).then(result => setSection(result.data))
    }, [])
    return (
        <div className="flex h-full" draggable={false}>
            <div className="flex flex-col flex-1">
                <CarouselItem section={section[0]} sectionName={sectionName} />
            </div>
        </div>
    )
}