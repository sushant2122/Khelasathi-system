import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import futsalSvc from "../../services/futsal.service";
import { toast } from "react-toastify";
import LoadingComponents, { LoadingSize } from "../../components/loading/loading.components";
import { useNavigate } from "react-router-dom";

// Define types
type FormData = {
    name: string;
    description: string;
    location: string;
    mapLink: string;
    contactNumber: string;
    panNumber: string;
    citizenshipFrontUrl?: FileList;
    citizenshipBackUrl?: FileList;
    imageUrl?: FileList;
};

// Define validation schema
const schema = yup.object().shape({
    name: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters")
        .required("Name is required"),

    description: yup
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(250, "Description too long.")
        .required("Description is required"),

    location: yup
        .string()
        .min(3, "Location must be at least 3 characters")
        .max(50, "Location cannot exceed 50 characters")
        .required("Location is required"),

    mapLink: yup
        .string()
        .required("Map link is required"),

    contactNumber: yup
        .string()
        .min(9, "Contact number must be at least 9 digits")
        .max(10, "Contact number cannot exceed 10 digits")
        .required("Contact number is required"),

    panNumber: yup
        .string()
        .required("PAN number is required"),

    citizenshipFrontUrl: yup
        .mixed<FileList>()
        .test("required", "Citizenship front is required", (value) => {
            return value && value.length > 0;
        })
        .test("fileType", "Only images are allowed", (value) => {
            if (!value || value.length === 0) return true;
            return value[0].type.startsWith('image/');
        }),
    citizenshipBackUrl: yup
        .mixed<FileList>()
        .test("required", "Citizenship back is required", (value) => {
            return value && value.length > 0;
        })
        .test("fileType", "Only images are allowed", (value) => {
            if (!value || value.length === 0) return true;
            return value[0].type.startsWith('image/');
        }),
    imageUrl: yup
        .mixed<FileList>()
        .test("required", "Futsal image is required", (value) => {
            return value && value.length > 0;
        }),
});

export default function FutsalProfilePages() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema) as Resolver<FormData>,
    });

    const imageRef = useRef<HTMLInputElement>(null);
    const frontCitizenshipRef = useRef<HTMLInputElement>(null);
    const backCitizenshipRef = useRef<HTMLInputElement>(null);

    const steps = [
        { title: 'Futsal Details', description: 'Enter futsal information' },
        { title: 'Documents', description: 'Upload required documents' },
        { title: 'Images', description: 'Upload futsal images' },
    ];

    const triggerRef = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof Pick<FormData, 'citizenshipFrontUrl' | 'citizenshipBackUrl' | 'imageUrl'>
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            setValue(fieldName, e.target.files);
        } else {
            setValue(fieldName, undefined);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            await futsalSvc.createFutsal(data);
            toast.success("Futsal registered successfully");
            navigate('/Venue', { replace: true });
            window.location.reload();
        } catch (error: any) {
            console.log("error", error.data.result);
            toast.error(error.data.result || "Failed to register futsal.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0
      border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0
      focus:border-amber-600 peer`;

    const labelStyle = `peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform
      -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100
      peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`;

    const getFirstFile = (files: FileList | undefined): File | null => {
        return files && files.length > 0 ? files[0] : null;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-4">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((_, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-1 w-16 ${index < currentStep ? "bg-amber-600" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center w-1/3">
                            <p className="text-sm font-medium">{step.title}</p>
                            <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
                {currentStep === 0 && (
                    <div className="space-y-6">
                        {[
                            { name: 'name', label: 'Futsal Name' },
                            { name: 'description', label: 'Description' },
                            { name: 'location', label: 'Location' },
                            { name: 'mapLink', label: 'Map Link' },
                            { name: 'contactNumber', label: 'Contact Number' },
                            { name: 'panNumber', label: 'PAN Number' },
                        ].map((field) => (
                            <div className="relative z-0 w-full group" key={field.name}>
                                <input
                                    type={field.name === 'contactNumber' || field.name === 'panNumber' ? 'text' : 'text'}
                                    id={field.name}
                                    {...register(field.name as keyof FormData)}
                                    placeholder=" "
                                    className={inputStyle}
                                />
                                <label htmlFor={field.name} className={labelStyle}>
                                    {field.label}
                                </label>
                                {errors[field.name as keyof FormData] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors[field.name as keyof FormData]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6">
                        {[
                            {
                                label: "Citizenship Front",
                                ref: frontCitizenshipRef,
                                fieldName: 'citizenshipFrontUrl' as const,
                                accept: "image/*"
                            },
                            {
                                label: "Citizenship Back",
                                ref: backCitizenshipRef,
                                fieldName: 'citizenshipBackUrl' as const,
                                accept: "image/*"
                            },
                        ].map(({ label, ref, fieldName, accept }, index) => (
                            <div key={index} className="space-y-2">
                                <input
                                    type="file"
                                    ref={ref}
                                    accept={accept}
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, fieldName)}
                                />
                                <button
                                    type="button"
                                    onClick={() => triggerRef(ref)}
                                    className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                                >
                                    Upload {label}
                                </button>
                                {watch(fieldName) && getFirstFile(watch(fieldName)) && (
                                    <div className="mt-4">
                                        <img
                                            src={URL.createObjectURL(getFirstFile(watch(fieldName))!)}
                                            alt={`${label} preview`}
                                            className="max-h-64 rounded-lg border border-gray-200"
                                        />
                                        <p className="text-sm mt-2">
                                            {getFirstFile(watch(fieldName))?.name} -
                                            {(getFirstFile(watch(fieldName))?.size || 0 / 1024).toFixed(0)} KB
                                        </p>
                                    </div>
                                )}
                                {errors[fieldName] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[fieldName]?.message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <input
                            type="file"
                            ref={imageRef}

                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'imageUrl')}
                        />
                        <button
                            type="button"
                            onClick={() => triggerRef(imageRef)}
                            className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                        >
                            Upload Futsal Image
                        </button>
                        {watch('imageUrl') && getFirstFile(watch('imageUrl')) && (
                            <div className="mt-4">
                                <img
                                    src={URL.createObjectURL(getFirstFile(watch('imageUrl'))!)}

                                    alt="Preview"
                                    className="max-h-64 rounded-lg"
                                />
                                <p className="text-sm mt-2">
                                    {getFirstFile(watch('imageUrl'))?.name} -
                                    {(getFirstFile(watch('imageUrl'))?.size || 0 / 1024).toFixed(0)} KB
                                </p>
                            </div>
                        )}
                        {errors.imageUrl && (
                            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        className={`px-4 py-2 text-gray-600 hover:text-gray-800 ${currentStep === 0 ? 'invisible' : ''
                            }`}
                    >
                        Previous
                    </button>

                    <button
                        type={currentStep === steps.length - 1 ? "submit" : "button"}
                        onClick={() => {
                            if (currentStep !== steps.length - 1) {
                                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                            }
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                        disabled={loading}
                    >
                        {loading ? <LoadingComponents size={LoadingSize.LG} /> :
                            currentStep === steps.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </form>
    );
}