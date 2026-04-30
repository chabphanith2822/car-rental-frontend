import Title from "../components/Title"
import { assets } from "../assets/assets"
import React, { useState, useEffect } from "react"
import CarCard from "../components/CarCard"
import { useSearchParams, useLocation } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"
import { motion } from 'framer-motion' 

const Cars = () => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const pickupLocation = searchParams.get('pickupLocation')
    const pickupDate = searchParams.get('pickupDate')
    const returnDate = searchParams.get('returnDate')

    const { cars, axios } = useAppContext()
    const [input, setInput] = useState('')
    const [filteredCars, setFilteredCars] = useState([])

    const applyFilter = () => {
        if (input === '') {
            setFilteredCars(cars)
        } else {
            const filtered = cars.filter((car) => {
                return car.brand.toLowerCase().includes(input.toLowerCase())
                    || car.model.toLowerCase().includes(input.toLowerCase())
                    || car.category.toLowerCase().includes(input.toLowerCase())
                    || car.transmission.toLowerCase().includes(input.toLowerCase())
            })
            setFilteredCars(filtered)
        }
    }

    const isSearchData = pickupLocation && pickupDate && returnDate

    const searchCarAvailability = async () => {
        try {
            const { data } = await axios.post('/api/bookings/check-availability', { 
                location: pickupLocation, 
                pickupDate, 
                returnDate 
            })
            if (data.success) {
                setFilteredCars(data.availableCars)
                if (data.availableCars.length === 0) {
                    toast.error('No Cars Available')
                }
            }
        } catch (error) {
            console.error("Search error:", error)
        }
    }

    useEffect(() => {
        if (isSearchData) {
            searchCarAvailability()
        }
    }, [isSearchData])

    useEffect(() => {
        if (cars.length > 0 && !isSearchData) {
            applyFilter()
        }
    }, [input, cars])

    const groupedCars = filteredCars.reduce((acc, car) => {
        const key = car.transmission || "Other"
        if (!acc[key]) acc[key] = []
        acc[key].push(car)
        return acc
    }, {})

    const sortOrder = ["Automatic", "Semi-Automatic", "Manual"];
    const sortedCategories = Object.keys(groupedCars).sort((a, b) => {
        return sortOrder.indexOf(a) - sortOrder.indexOf(b);
    });

    return (
        <div className="pb-20">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='flex flex-col items-center py-20 bg-light max-md:px-4'
            >
                <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='flex items-center bg-white px-4 mt-6 max-w-xl w-full h-12 rounded-full shadow cursor-pointer'
                >
                    <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        type="text" 
                        placeholder='Search by make, model, or feature' 
                        className='w-full h-full outline-none text-gray-500' 
                    />
                    <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
                </motion.div>
            </motion.div>

            {/* Cars Listing Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'
            >
                <div className="max-w-6xl mx-auto">
                    <p className='text-gray-500 mb-10'>
                        Showing {filteredCars.length} Cars
                    </p>

                    {sortedCategories.length > 0 ? (
                        sortedCategories.map((type, catIndex) => (
                            <div key={catIndex} className="mb-16">
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-xl font-bold text-[#1a2b49] whitespace-nowrap">
                                        {type} Transmission
                                    </h2>
                                    <div className="h-1px bg-gray-200 w-full mt-2"></div>
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                                    {groupedCars[type].map((car, index) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.4 }}
                                            key={car._id || index}
                                            className="flex justify-center"
                                        >
                                            <div className="w-full max-w-[340px]">
                                                <CarCard car={car} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400">No cars found matching your search.</div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Cars