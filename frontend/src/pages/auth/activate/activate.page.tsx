import { useEffect, useState } from 'react'
import LoadingComponents, { LoadingSize } from '../../../components/loading/loading.components';
import { useNavigate, useParams } from 'react-router-dom';
import authSvc from '../auth.service';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';

function ActivateUserPage() {
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const activateUser = async () => {
        try {
            await authSvc.activateUser(params.token as string)

            toast.success("Account successfully activated.please login to continue...")
            navigate('/signin')
        } catch (exception: any) {
            console.log("exception", exception);
            if (+exception.status === 400 && exception.data.status === 'ACTIVATION_TOKEN_EXPIRED') {

                Swal.fire({
                    title: "Token Expired!",
                    text: "Your token has been expired. DO you wish to resend email?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Confirm"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await authSvc.resendActivationToken(params.token as string)
                        toast.success("A new token has been resend. please check your email.")
                        navigate('/');
                    } else {
                        navigate('/');
                    }
                });
            }
            else {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: 'account already activated or invalid token.'
                });
                navigate('/signin');
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        activateUser()
    }, [])
    return (
        <>
            {loading ? <>

                <section className="bg-white dark:bg-gray-900 mt-20 mb-20">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div className="mx-auto max-w-screen-sm text-center justify-center">
                            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-amber-700 dark:text-primary-500">  <LoadingComponents size={LoadingSize.XL} className='justify-center' /></h1>
                            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">User account is getting activated.</p>
                            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, it can take up sometime. </p>

                        </div>
                    </div>
                </section>

            </> : <>
            </>}
        </>
    )
}

export default ActivateUserPage
