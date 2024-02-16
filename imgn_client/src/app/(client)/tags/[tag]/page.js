"use client"
import React from 'react'

export default ({ params }) => {
    const { tag } = params;
    return (
        <div>{tag}</div>
    )
}
