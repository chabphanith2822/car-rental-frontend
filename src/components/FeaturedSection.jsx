import React from "react"
import Title from "./Title"
import CarCard from "./CarCard"
import { useNavigate } from 'react-router-dom'
import { useAppContext } from "../context/AppContext"
import { motion } from "motion/react"

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { cars } = useAppContext()

    const autoCars = cars.filter(car => car.transmission === 'Automatic').slice(0, 6);
    const semiAutoCars = cars.filter(car => car.transmission === 'Semi-Automatic').slice(0, 6);
    const manualCars = cars.filter(car => car.transmission === 'Manual').slice(0, 6);

    const RenderCarGroup = (title, carList) => (
		carList.length > 0 && (
			<div className="w-full mt-10"> 
				<div className="flex items-center gap-3 mb-5">
					<h2 className="text-xl font-bold text-gray-800">{title}</h2>
					<div className="h-px flex-1 bg-gray-200"></div>
				</div>
				
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'> 
					{carList.map((car) => (
						<motion.div 
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							key={car._id}
							className="transform scale-90 origin-top" 
						>
							<CarCard car={car} />
						</motion.div>
					))}
				</div>
			</div>
		)
	);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles categorized by transmission.'/>
            </motion.div>

            {RenderCarGroup("Automatic Transmission", autoCars)}
            {RenderCarGroup("Semi-Automatic Transmission", semiAutoCars)}
            {RenderCarGroup("Manual Transmission", manualCars)}

            <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ delay: 0.6, duration: 0.6 }}
                onClick={() => {
                    navigate('/cars'); window.scrollTo(0, 0)
                }}
                className='flex items-center justify-center gap-2 px-8 py-3 border border-borderColor hover:bg-gray-50 rounded-md mt-20 cursor-pointer font-medium'
            >
                Explore All Cars <span className="text-lg">→</span> 
            </motion.button>

        </motion.div>
    )
}

export default FeaturedSection