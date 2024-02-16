"use client"
import { useRef, useState } from 'react'
import Social from './Social'

export default ({ social, setSocial, changeData }) => {

    const dragPerson = useRef(0)
    const draggedOverPerson = useRef(0)
    const handleSort = () => {
        const socialClone = [...social]
        const temp = socialClone[dragPerson.current]
        socialClone[dragPerson.current] = socialClone[draggedOverPerson.current]
        socialClone[draggedOverPerson.current] = temp
        setSocial(socialClone)
    }

    return (
        <main className="flex flex-col gap-10">
            {social.map((person, index) => (
                <div draggable
                    onDragStart={() => (dragPerson.current = index)}
                    onDragEnter={() => (draggedOverPerson.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    key={index}>
                    <Social changeData={changeData} _id={person._id} index={person.index} name={person.name} link={person.link} icon={person.icon} />
                </div>
            ))}
        </main>
    )
}