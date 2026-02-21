import { Calendar, TrendingUp, MapPinned, CalendarX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import venueStatsSvc from '../../services/venue-stats';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

function VenueDashboardPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);
    const [transactionData, setTransactionData] = useState<any[]>([]);

    const viewStats = async () => {
        try {
            const response = await venueStatsSvc.listVenueStats();
            setStats(response.data.result || []);
        } catch (exception) {
            console.log("error", exception);
        }
    };

    const listLatestBookings = async () => {
        try {
            const response = await venueStatsSvc.listLatestBookings();
            setBookings(response.data.result || []);
        } catch (exception) {
            console.log("error", exception);
        }
    };

    const listMonthlyRevenue = async () => {
        try {
            const response = await venueStatsSvc.listForMonthlyRevenue();
            setRevenueData(response.data.result || []);
        } catch (exception) {
            console.log("error", exception);
        }
    };

    const listBookingCount = async () => {
        try {
            const response = await venueStatsSvc.listBookingStatus();
            setBookingStatusData(response.data.result || []);
        } catch (exception) {
            console.log("error", exception);
        }
    };

    const listRecentTransaction = async () => {
        try {
            const response = await venueStatsSvc.listLatestTransaction();
            setTransactionData(response.data.result || []);
        } catch (exception) {
            console.log("error", exception);
        }
    };

    useEffect(() => {
        viewStats();
        listLatestBookings();
        listMonthlyRevenue();
        listBookingCount();
        listRecentTransaction();
    }, []);

    // Function to format date string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getBookingStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // Function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'text-green-500';
            case 'refunded':
                return 'text-blue-500';
            case 'refund-failed':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className='p-4'>
            <h1 className="text-2xl font-semibold text-amber-700">Dashboard Overview</h1>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon === 'Calendar' ? Calendar :
                        stat.icon === 'TrendingUp' ? TrendingUp :
                            stat.icon === 'MapPinned' ? MapPinned : CalendarX;
                    // stat.icon === 'Users' ? Users : CreditCard;
                    return (
                        <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Icon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B98133" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bookings by Venue */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                            <div key={booking.booking_id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Booking #{booking.booking_id} - {booking.court_title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {booking.customer_name} • {formatDate(booking.booking_date)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Booked at: {new Date(booking.booked_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">
                                        Rs. {parseFloat(booking.total_amount).toFixed(2)}
                                    </span>
                                    <span className={`text-xs ${getBookingStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {transactionData.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Payment #{transaction.id} - {transaction.court}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {transaction.venue} • {formatDate(transaction.date)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">
                                        ${parseFloat(transaction.amount).toFixed(2)}
                                    </span>
                                    <span className={`text-xs ${getStatusColor(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Status */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Status</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookingStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {bookingStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VenueDashboardPage;