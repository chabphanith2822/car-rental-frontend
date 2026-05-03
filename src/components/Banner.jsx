import React from "react"
import { assets } from "../assets/assets"
import { motion } from 'motion/react'

const Banner = () => {
    return (
        <motion.div 
        initial={{opacity: 0, y: 50}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-10 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden my-16'>

            <div className='text-white md:w-1/2 mb-8 md:mb-0'>
                <h2 className='text-3xl font-medium mb-4'>Need Help Choosing a Car?</h2>
                <p className='mt-2 mb-3'>Contact our 24/7 support for the best car rental experience.</p>
                <p className="max-w-130 mb-6">We offer the best premium car collection with flexible booking options. Contact us now to find the perfect ride for your trip!</p>
                
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all cursor-pointer">
                   Contact Us
                </button>
            </div>

            <div className="md:w-1/2 flex justify-center md:justify-end">
                <motion.img 
                initial={{opacity: 0, x: 50}}
                whileInView={{opacity: 1, x:0}}
                transition={{duration: 0.6, delay: 0.4}}
                src={assets.banner_car_image} alt="Luxury Car" className='max-h-48 mt-10'/>
            </div>

        </motion.div>
    )
}

export default Banner