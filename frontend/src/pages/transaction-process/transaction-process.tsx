import { useLocation, useNavigate } from "react-router-dom";
import LoadingComponents, { LoadingSize } from "../../components/loading/loading.components";
import { useEffect, useMemo, useState } from "react";
import transactionSvc from "../../services/transaction.service";
import { toast } from "react-toastify";

function TransactionProcessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [apiCalled, setApiCalled] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasNavigated, setHasNavigated] = useState(false);

    const queryParams = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            status: params.get("status"),
            t: params.get("t"),
            idx: params.get("idx"),
            token: params.get("token"),
            bank_reference: params.get("bank_reference"),
            amount: params.get("amount"),
            mobile: params.get("mobile"),
            transaction_id: params.get("transaction_id"),
            tidx: params.get("tidx"),
            total_amount: params.get("total_amount"),
            purchase_order_id: params.get("purchase_order_id"),
            purchase_order_name: params.get("purchase_order_name"),
            pidx: params.get("pidx"),
            message: params.get("message")
        };
    }, [location.search]);

    const handlePaymentCancelled = () => {
        if (hasNavigated) return;
        setHasNavigated(true);
        toast.error("Payment was cancelled");
        setTimeout(() => navigate('/'), 2000);
    };

    const handlePaymentError = (errorMessage: string) => {
        if (hasNavigated) return;
        setHasNavigated(true);
        toast.error(errorMessage);
        navigate('/');
    };

    const processPayment = async () => {
        if (isProcessing || apiCalled) return;

        setIsProcessing(true);
        setApiCalled(true);

        try {
            // Check if payment was cancelled
            if (queryParams.message) {
                handlePaymentCancelled();
                return;
            }

            // Validate required parameters
            if (!queryParams.pidx || !queryParams.purchase_order_id) {
                handlePaymentError("Payment information incomplete");
                return;
            }

            const paymentData = {
                pidx: queryParams.pidx,
                amount: queryParams.amount,
                purchase_order_id: queryParams.purchase_order_id,
                transaction_id: queryParams.transaction_id,
                message: queryParams.message
            };

            const response = await transactionSvc.callbackKhalti(paymentData);

            if (response.data?.status === "PAYMENT_SUCCESS") {
                if (hasNavigated) return;
                setHasNavigated(true);

                toast.success(response.data.message || "Payment processed successfully");
                setTimeout(() => navigate('/my-booking'), 1500);
            } else {
                handlePaymentError(response.data?.message || 'Payment processing failed');
            }
        } catch (error: any) {
            console.error("Payment error:", error);

            let errorMessage = "Payment processing failed";
            if (error?.data?.result?.message) {
                errorMessage = error.data.result.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (queryParams.message) {
                errorMessage = queryParams.message;
            }

            handlePaymentError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!apiCalled && !isProcessing) {
            processPayment();
        }
    }, [queryParams, apiCalled, isProcessing]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%'
            }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <LoadingComponents size={LoadingSize.XL} />
                </div>
                <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                    {isProcessing ? "Processing Payment" : "Payment Processed"}
                </h2>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    {isProcessing
                        ? "Please wait while we process your transaction..."
                        : "Redirecting you to your bookings..."}
                </p>
            </div>
        </div>
    );
}

export default TransactionProcessPage;