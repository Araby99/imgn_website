import React from 'react'
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import SectionCarousel from './SectionCarousel';


export default () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <div className="w-[95%] my-20 md:my-auto md:w-[80%] mx-auto">
            <Carousel responsive={responsive}
                infinite={true}
                autoPlaySpeed={5000}
                pauseOnHover={true}
                arrows={false}
            // autoPlay={true}
            >
                <div className="md:mx-30 md:py-[80px] h-full select-none">
                    <div className='md:skew-x-[-20deg] bg-white h-full w-full'>
                        <SectionCarousel sectionName="news" />
                    </div>
                </div>
                <div className="mx-30 py-[80px] h-full select-none">
                    <div className='skew--20 bg-white h-full w-full'>
                        <SectionCarousel sectionName="articles" />
                    </div>
                </div>
            </Carousel>
        </div>
    )
}
