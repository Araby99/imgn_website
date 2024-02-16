"use client"
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import { useParams, useRouter } from 'next/navigation';
import Creatable from 'react-select/creatable';

export default () => {
    const { id } = useParams();
    const [news, setNews] = useState();
    const router = useRouter();
    const [related, setRelated] = useState([])
    useEffect(() => {
        axios.get(`/news/${id}`).then(res => {
            setNews(res.data)
            let tagList = [];
            res.data.tags.forEach(tag => {
                const newTag = {
                    value: tag.tag,
                    label: tag.tag
                }
                tagList.push(newTag)
            });
            setdefaultTags(tagList)
            let relatedArr = [];
            for (let i = 0; i < res.data.related.length; i++) {
                relatedArr.push(axios.get(`/news/${res.data.related[i]}`))
            }
            relatedArr.length && axios.all(relatedArr).then(axios.spread((...res) => {
                res.forEach(r => {
                    setRelated(related => [...related, r.data].filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t._id === value._id
                        ))
                    ))
                })
            }))
        }).catch(err => {
            if (err.response.status) {
                router.push("/404")
            }
        })
        axios.get("/tags").then(result => {
            let res = [];
            result.data.forEach(tag => {
                const newTag = {
                    value: tag.tag,
                    label: tag.tag
                }
                res.push(newTag)
            });
            setTags(res)
        })
    }, [])
    const editorRef = useRef(null);
    const input = useRef(null);
    const avatar = useRef(null);
    const tagsInput = useRef(null);
    const relatedID = useRef(null);
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(false)
    const [relatedLoading, setrelatedLoading] = useState(false)
    const [tags, setTags] = useState();
    const [defaultTags, setdefaultTags] = useState();
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
            formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_NEWS);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
            axios.post(process.env.NEXT_PUBLIC_CLOUD, formData).then(image => {
                const title = e.target.title.value;
                const subTitle = e.target.subTitle.value;
                const hero = image.data.secure_url;
                const description = content;
                axios.put(`/news/${news._id}`, { title, subTitle, hero, description }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(res => {
                    setLoading(false)
                    toast.success('تمت تعديل الخبر بنجاح !', {
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
            let rel = [];
            related.forEach(r => rel.push(r._id))
            const tagList = tagsInput.current.getValue();
            let newTags = [];
            let tags = []
            tagList.forEach(tag => {
                const newTag = {
                    tag: tag.value
                }
                tags.push(newTag)
                if (tag.__isNew__) newTags.push(newTag)
            })
            newTags.length && axios.post("/tags", newTags);
            axios.put(`/news/${news._id}`, { title, subTitle, description, tags, related: rel }, { headers: { admin: localStorage.getItem("token") ? localStorage.getItem("token") : sessionStorage.getItem("token") } }).then(res => {
                setLoading(false)
                toast.success('تمت تعديل الخبر بنجاح !', {
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
                        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_NEWS);
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
    const addRelated = () => {
        const id = relatedID.current.value;
        if (!related.filter(r => r._id == id).length) {
            setrelatedLoading(true)
            axios.get(`/news/${id}`).then(result => {
                setRelated(current => [...current, result.data])
                setrelatedLoading(false)
            }).catch(e => console.log(e))
        }
    }
    const removeRelated = id => {
        setRelated(related => related.filter(r => r._id !== id))
    }
    return (
        <>
            <form onSubmit={uploadImages} className='flex flex-col gap-5'>
                <p className='text-xl text-[#511752] font-bold'>عنوان رئيسي</p>
                <input defaultValue={news?.title} type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='title' />
                <p className='text-xl text-[#511752] font-bold'>عنوان فرعي</p>
                <input defaultValue={news?.subTitle} type="text" required className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='subTitle' />
                <p className='text-xl text-[#511752] font-bold'>الصورة</p>
                <div className='flex gap-5 items-center'>
                    <input type="file" accept='image/*' onChange={e => changeAvatar(e)} />
                    <img className='h-20' src={news?.hero} ref={avatar} alt='cover' />
                </div>
                <p className='text-xl text-[#511752] font-bold'>الموضوع</p>
                <input ref={input} type="file" name="my-file" style={{ display: "none" }} />
                <Editor
                    apiKey='zjeadngacnhe53lncorv2wtw4xh15vpcduqt933u4jkx45gd'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={news?.description}
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
                <p className='text-xl text-[#511752] font-bold'>العلامات "اختياري"</p>
                {defaultTags && <Creatable ref={tagsInput} defaultValue={defaultTags} options={tags} placeholder="العلامات..." isMulti closeMenuOnSelect={false} className='md:w-[50%]' />}
                <p className='text-xl text-[#511752] font-bold'>الأخبار المرتبطة "اختياري"</p>
                <div className="flex gap-10">
                    <input ref={relatedID} type="text" className='px-4 py-2 w-[300px] rounded-full bg-[#E8E6FF]' name='id' />
                    <button onClick={() => addRelated()} disabled={relatedLoading} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[100px] bg-[#E8E6FF]'>إضافة</button>
                </div>
                {
                    related?.map((rel, index) => (
                        <div key={index} className='flex items-center gap-5'>
                            <img src={rel.hero} alt={rel.title} className='h-[50px] w-[50px] object-cover' />
                            <p className='text-imgn-purple font-bold'>{rel.title}</p>
                            <button onClick={() => removeRelated(rel._id)} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[100px] bg-[#E8E6FF]'>حذف</button>
                        </div>
                    ))
                }
                <button type='submit' disabled={loading} className='flex justify-center py-2 text-[#511752] font-bold rounded-full w-[300px] bg-[#E8E6FF]'>
                    {loading ? (
                        <Puff
                            height="30"
                            width="30"
                            radius={1}
                            color="#511752"
                            ariaLabel="puff-loading"
                        />
                    ) : "تعديل الخبر"}
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
