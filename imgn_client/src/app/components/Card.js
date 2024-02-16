import Link from 'next/link'
import React from 'react'

export default (props) => {
    return (
        <Link
            href={`/${props.type}/${props._id}`}
            className="cursor-pointer h-full w-full skew-x-n20 aspect-video transition-all duration-75 ease-in-out block relative top-0 hover:-top-2 shadow-lg hover:shadow-xl bg-white overflow-hidden"
        >
            <img
                className="object-cover h-full w-full scale-130 skew-x-20"
                src={props.hero}
                alt={props.title}
            />
            <div
                className="absolute flex items-end justify-center bottom-0 from-70% left-0 top-[60%] right-0 p-4 text-lg font-bold text-white bg-gradient-to-t from-black to-transparent"
            >
                <p className="text-center skew-x-20">
                    {props.title}
                </p>
            </div>
        </Link>
    )
}
