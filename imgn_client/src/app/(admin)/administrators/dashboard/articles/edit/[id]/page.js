"use client"
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import { useParams, useRouter } from 'next/navigation';

export default () => {
    const { id } = useParams();
    const [articles, setArticles] = useState();
    const router = useRouter();
    useEffect(() => {
        axios.get(`/articles/${id}`).then(res => {
            setArticles(res.data)
        }).catch(err => {
            if (err.response.status) {
                router.push("/404")
            }
        })
    }, [])
    const editorRef = useRef(null);
    const input = useRef(null);
    const avatar = useRef(null);
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(false)
    const createElementFromHTML = (htmlString) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
    const changeAvatar = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    const uploadRest = (content, e) => {
        if (avatar.current.src.search("https://res.cloudinary.com") == -1) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_ARTICLES);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
            axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(image => {
                const title = e.target.title.value;
                const subTitle = e.target.subTitle.value;
                const hero = image.data.secure_url;
                const description = content;
                axios.put(`/articles/${articles._id}`, { title, subTitle, hero, description }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(res => {
                    setLoading(false)
                    toast.success('تمت تعديل المقال بنجاح !', {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }).catch(err => console.log(err))
            })
        } else {
            const title = e.target.title.value;
            const subTitle = e.target.subTitle.value;
            const description = content;
            axios.put(`/articles/${articles._id}`, { title, subTitle, description }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(res => {
                setLoading(false)
                toast.success('تمت تعديل المقال بنجاح !', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }).catch(err => console.log(err))
        }
    }
    const uploadImages = e => {
        e.preventDefault();
        setLoading(true)
        if (editorRef.current) {
            let content = editorRef.current.getContent();
            const htmlContent = createElementFromHTML(`<div>${content}</div>`);
            const imgs = Array.from(htmlContent.getElementsByTagName("img"));
            if (imgs.length) {
                imgs.forEach((img, index) => {
                    const { src } = img;
                    if (src.search("https://res.cloudinary.com") == -1) {
                        const formData = new FormData();
                        formData.append("file", img.src);
                        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_ARTICLES);
                        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
                        axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(image => {
                            content = content.replace(img.src, image.data.secure_url)
                            if (index == imgs.length - 1) {
                                uploadRest(content, e)
                            }
                        }).catch(err => console.log(err))
                    } else {
                        if (index == imgs.length - 1) {
                            uploadRest(content, e)
                        }
                    }
                })
            } else {
                uploadRest(content, e)
            }
        }
    }
    return (
        <>
            <form onSubmit={uploadImages} className='flex flex-col gap-5'>
                <p className='text-xl text-[#511752] font-bold'>عنوان رئيسي</p>
                <input defaultValue={articles?.title} type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='title' />
                <p className='text-xl text-[#511752] font-bold'>عنوان فرعي</p>
                <input defaultValue={articles?.subTitle} type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='subTitle' />
                <p className='text-xl text-[#511752] font-bold'>الصورة</p>
                <div className='flex gap-5 items-center'>
                    <input type="file" accept='image/*' onChange={e => changeAvatar(e)} />
                    <img className='h-20' src={articles?.hero} ref={avatar} alt='cover' />
                </div>
                <p className='text-xl text-[#511752] font-bold'>الموضوع</p>
                <input ref={input} type="file" name="my-file" style={{ display: "none" }} />
                <Editor
                    apiKey='zjeadngacnhe53lncorv2wtw4xh15vpcduqt933u4jkx45gd'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={articles?.description}
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
                    ) : "تعديل المقال"}
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
