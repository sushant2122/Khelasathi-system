import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePages from "../pages/home/home.pages"
import FutsalPage from "../pages/futsal/futsal.pages"
import ContactusPage from "../pages/contactus/contactus.pages"
import AboutusPage from "../pages/aboutus/aboutus.pages"
import ErrorPage from "../pages/errors/error.pages"
import FutsalDetailPage from "../pages/futsaldetail/futsaldetail.pages"
import AdminDashboardPage from "../pages/admin-dashboard/admindashboard.pages"
import VenueDashboardPages from "../pages/venue-dashboard/venuedashboard.pages"
import { SigninPage, SignupPage } from "../pages/auth"
import { AdminLayout, VenueLayout, HomeLayout } from "../pages/layouts"
import MyPointPages from "../pages/My-point/my-point.pages"
import VenueBookingPage from "../pages/venue-booking/venue-booking.pages"
import UserProfilePage from "../pages/profile/user.profile.pages"
import UserSettingPage from "../pages/setting/user.setting.pages"
import UserBookingPage from "../pages/user-booking/user-booking.pages"
import ForgotPasswordPage from "../pages/forgot-password/forgot-password.pages"
import VenueTransactionPages from "../pages/venue-transaction/venue-transaction.pages"
import VenueSettingPages from "../pages/venue-setting/venue-setting.pages"
import FutsalProfilePages from "../pages/venue-futsal/futsal-profile.pages"
import VenueProfilePage from "../pages/profile/venue.profile.pages"
import TagPage from "../pages/tag/tag.page"
import AdminTransactionPage from "../pages/admin-transaction/admin-transaction"
import AdminBannerPage from "../pages/admin-banner/admin-banner.pages"
import AdminBookingPage from "../pages/admin-booking/admin-booking.pages"
import AdminFutsalVerificationPages from "../pages/admin-futsalverification/admin-futsalverification.pages"

import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ActivateUserPage from "../pages/auth/activate/activate.page"
import { AuthProvider } from "../context/auth.context"
import PermissionChecker from "./permission.config"
import ResetPasswordPage from "../pages/reset-password/reset-password.pages"
import TransactionProcessPage from "../pages/transaction-process/transaction-process"
import UserTransactionPage from "../pages/user-transaction/user-transaction.pages"
import FutsalDetailProfilePages from "../pages/futsal-profile/futsal-profile.pages"
import FutsalImagePage from "../pages/futsalimage/futsal-image.pages"

function RoutingConfig() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <ToastContainer />

                    <Routes>
                        <Route path="/signin" element={<SigninPage />}></Route>
                        <Route path="/signup" element={<SignupPage />}></Route>
                        <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />}></Route>
                        <Route path="/transaction-process" element={<TransactionProcessPage />}></Route>

                        <Route path="/" element={<HomeLayout />}>
                            <Route index element={<HomePages />}></Route>
                            <Route path="futsal" element={<FutsalPage />}></Route>
                            <Route path="about-us" element={<AboutusPage />}></Route>

                            {/* Protected player routes - only require login */}
                            <Route path="my-point" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <MyPointPages />
                                </PermissionChecker>
                            }></Route>
                            <Route path="my-transaction" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <UserTransactionPage />
                                </PermissionChecker>
                            }></Route>
                            <Route path="my-booking" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <UserBookingPage />
                                </PermissionChecker>
                            }></Route>
                            <Route path="user-profile" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <UserProfilePage />
                                </PermissionChecker>
                            }></Route>
                            <Route path="setting" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <UserSettingPage />
                                </PermissionChecker>
                            }></Route>

                            <Route path="activate/:token" element={

                                <ActivateUserPage />

                            }></Route>
                            <Route path="futsal/:slug" element={

                                <FutsalDetailPage />

                            }></Route>
                            <Route path="contact-us" element={
                                <PermissionChecker allowedBy="Player" requireLoginOnly>
                                    <ContactusPage />
                                </PermissionChecker>
                            }></Route>
                            <Route path="*" element={<ErrorPage title="Back to Homepage" link="/" />}></Route>
                        </Route>

                        <Route path="/admin" element={<PermissionChecker allowedBy="Admin">
                            <AdminLayout />
                        </PermissionChecker>
                        }>
                            <Route index element={<AdminDashboardPage />}></Route>
                            <Route path="transaction" element={<AdminTransactionPage />}></Route>
                            <Route path="banner" element={<AdminBannerPage />}></Route>
                            <Route path="booking" element={<AdminBookingPage />}></Route>
                            <Route path="setting" element={<UserSettingPage />}></Route>
                            <Route path="futsal-verification" element={<AdminFutsalVerificationPages />}></Route>
                            <Route path="*" element={<ErrorPage title="Back to Dashboard" link="/admin" />}></Route>


                        </Route>

                        <Route path="/venue" element={<PermissionChecker allowedBy="Venue">
                            <VenueLayout />
                        </PermissionChecker>
                        }>
                            <Route index element={<VenueDashboardPages />}></Route>
                            <Route path="booking-history" element={<VenueBookingPage />}></Route>
                            <Route path="venue-setting" element={<VenueSettingPages />}></Route>
                            <Route path="venue-transaction" element={<VenueTransactionPages />}></Route>
                            <Route path="futsal" element={<FutsalProfilePages />}></Route>
                            <Route path="futsal-image" element={<FutsalImagePage />}></Route>
                            <Route path="venue-account-setting" element={<UserSettingPage />}></Route>
                            <Route path="venueowner-profile" element={<VenueProfilePage />}></Route>
                            <Route path="venue-profile" element={<FutsalDetailProfilePages />}></Route>
                            <Route path="tag" element={<TagPage />}></Route>
                            <Route path="*" element={<ErrorPage title="Back to Dashboard" link="/venue" />}></Route>
                        </Route>


                    </Routes>
                </BrowserRouter>


            </AuthProvider >
        </>
    )
}

export default RoutingConfig
