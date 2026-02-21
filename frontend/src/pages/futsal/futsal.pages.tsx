
import FutsalTitleComponent from "../../components/common/title/futsal.title.components";
import FutsalCardComponent from "../../components/common/cards/futsal.card.components";
import { useEffect, useState } from "react"
import futsalSvc from "../../services/futsal.service"
import LoadingComponents, { LoadingSize } from "../../components/loading/loading.components";


export interface Futsal {
    futsal_id: number;
    name: string;
    location: string;
    description: string;
    contact_number: string;
    is_active: boolean;
    verification_status: string;
    image_url?: string; // Assuming you might want to add this later
    slug: string;
}

function FutsalPage() {
    const [futsals, setFutsals] = useState<Futsal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const listFutsals = async () => {
        try {
            setLoading(true);

            const response = await futsalSvc.listForFutsal();
            setFutsals(response.data.result.list);
        } catch (err) {
            console.error("Futsal fetch error:", err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listFutsals();
    }, []);
    return (
        <>
            {
                loading ? <>
                    <LoadingComponents size={LoadingSize.XL} /></>
                    : <>
                        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
                            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                                <FutsalTitleComponent />
                                <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                                    {futsals.map((futsal) => (
                                        <FutsalCardComponent
                                            key={futsal.futsal_id}
                                            name={futsal.name}

                                            link={`/futsal/${futsal.slug}`}

                                            image={futsal.image_url || "default-futsal-image.jpg"}

                                            location={futsal.location}
                                            contact={futsal.contact_number}


                                        />
                                    ))}

                                </div>

                            </div>
                        </section >
                    </>
            }

        </>
    )
}

export default FutsalPage

