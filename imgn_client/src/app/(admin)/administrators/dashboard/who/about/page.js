"use client"
import 'react-toastify/dist/ReactToastify.css';
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import axios from 'axios';

export default () => {
    const editorRef = useRef(null);
    const input = useRef(null);
    const [loading, setLoading] = useState(false)
    const submit = e => {
        setLoading(true)
        e.preventDefault();
        const about = editorRef.current.getContent();
        axios.put("/about", { about }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then((res) => {
            setLoading(false)
            toast.success('تمت التحديث بنجاح !', {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
    }
    return (
        <>
            <form onSubmit={submit} className='flex flex-col gap-5'>
                <Editor
                    apiKey='zjeadngacnhe53lncorv2wtw4xh15vpcduqt933u4jkx45gd'
                    onInit={(evt, editor) => editorRef.current = editor}
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        images_file_types: 'jpg,svg,webp',
                        file_picker_types: 'file image media',
                        file_picker_callback: (callback, value, meta) => {
                            if (meta.filetype == 'image') {
                                input.current.click();
                                input.current.onchange = () => {
                                    var file = input.current.files[0];
                                    var reader = new FileReader();
                                    reader.onload = e => {
                                        callback(e.target.result, {
                                            alt: file.name
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                };
                            }
                        },
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                    }}
                />
                <button type='submit' disabled={loading} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]'>
                    {loading ? (
                        <Puff
                            height="30"
                            width="30"
                            radius={1}
                            color="#511752"
                            ariaLabel="puff-loading"
                        />
                    ) : "حفظ التعديلات"}
                </button>
            </form>
            <ToastContainer
                position="bottom-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}
