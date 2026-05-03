import React, { useState, useEffect } from "react"
import Title from "../../components/owner/Title"
import { useAppContext } from "../../context/AppContext.jsx"
import toast from "react-hot-toast"

const ManageBookings = () => {
    const { currency, axios, backendUrl } = useAppContext() 
    const [bookings, setBookings] = useState([])

    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner')
            if (data.success) {
                setBookings(data.bookings)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const markAsPaid = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status: 'confirmed', payment: true })
            if (data.success) {
                toast.success("Payment Confirmed!")
                fetchOwnerBookings()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

	const removeBooking = async (bookingId) => {
		if (window.confirm("Are you sure you want to delete this booking record?")) {
			try {
				const { data } = await axios.post('/api/bookings/delete', { bookingId });
				if (data.success) {
					toast.success(data.message);
					fetchOwnerBookings();
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error("Failed to delete");
			}
		}
	}

    useEffect(() => {
        fetchOwnerBookings()
    }, [])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests."/>

            <div className='max-w-5xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500 bg-gray-50'>
                        <tr>
                            <th className="p-3 font-medium">Car</th>
                            <th className="p-3 font-medium max-md:hidden">Date Range</th>
                            <th className="p-3 font-medium">Total</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Payment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index} className='border-t border-borderColor text-gray-500 hover:bg-gray-50'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={booking.car?.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                                    <p className='font-medium max-md:hidden'>{booking.car?.brand} {booking.car?.model}</p>
                                </td>

                                <td className='p-3 max-md:hidden'>
                                    {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                                </td>

                                <td className='p-3 font-semibold text-gray-700'>{currency}{booking.price}</td>

                                <td className='p-3'>
									<select 
										onChange={e => changeBookingStatus(booking._id, e.target.value)} 
										value={booking.status} 
										className={`px-2 py-1.5 text-xs border rounded-md outline-none bg-white font-medium transition-all ${
											booking.status === 'confirmed' ? 'text-green-600' : 
											booking.status === 'cancelled' ? 'text-red-600' : 
											booking.status === 'completed' ? 'text-blue-600' : 
											'text-gray-500 border-borderColor'
										}`}>

										<option value="pending">Pending</option>
										<option value="confirmed">Confirmed</option>
										<option value="cancelled">Cancelled</option>
										<option value="completed">Completed</option>
									</select>
								</td>

                                <td className='p-3'>
									<div className='flex items-center gap-3'> 										
										{booking.payment ? (
											<span className="text-green-500 font-medium flex items-center gap-1">
												Paid ✅
											</span>
										) : (
											<button 
												onClick={() => markAsPaid(booking._id)}
												className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all"
											>
												Mark Paid
											</button>
										)}

										<button 
											onClick={() => removeBooking(booking._id)}
											className="p-1.5 text-red-500 transition-all duration-300"
											title="Delete"
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>

									</div>
								</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && <p className="p-5 text-center text-gray-400">No bookings found.</p>}
            </div>
        </div>
    )
}

export default ManageBookings