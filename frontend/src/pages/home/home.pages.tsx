import BannerComponent from "../../components/banners/banners.components"
import TitleComponent from "../../components/common/title/title.components"
import FutsalCardComponent from "../../components/common/cards/futsal.card.components"
import ServicesCardComponent from "../../components/common/cards/services.card.components"
import { faCreditCard, faFutbol, faClock, faHistory } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import futsalSvc from "../../services/futsal.service"
import { toast } from "react-toastify"
import SwiperComponent from "../../components/swiper/swiper.component"
import KhelaSathiMessage from "../../components/message-section/message-section.component"

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

function HomePages() {
    const [futsals, setFutsals] = useState<Futsal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const listFutsals = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await futsalSvc.listHomeFutsal();
            setFutsals(response.data.result.list);
        } catch (err) {
            console.error("Futsal fetch error:", err);
            setError("Failed to load futsals");
            toast.error('Failed to fetch futsals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listFutsals();
    }, []);

    return (
        <>
            <BannerComponent />

            <section>
                <TitleComponent title="Our Services" />
                <div className="flex flex-wrap justify-center gap-11 w-89 text-gray-500 dark:text-gray-400">
                    <ServicesCardComponent icon={faFutbol} title="Court Booking" />
                    <ServicesCardComponent icon={faClock} title="Real-time Availability" />
                    <ServicesCardComponent icon={faCreditCard} title="Online Payment" />
                    <ServicesCardComponent icon={faHistory} title="Booking History" />
                </div>
            </section>

            <section className="p-4">
                <TitleComponent title="Top Futsals" link="/futsal" />
                {loading ? (
                    <div className="text-center py-8">Loading futsals...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                    <div className="bg-white mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                        {futsals.map((futsal) => (
                            <FutsalCardComponent
                                key={futsal.futsal_id}
                                name={futsal.name}
                                // location={futsal.location}
                                //  description={futsal.description}
                                //  contact={futsal.contact_number}
                                link={`/futsal/${futsal.slug}`}
                                // You can add default image or use actual image if available
                                image={futsal.image_url || "default-futsal-image.jpg"}
                                // These might need to come from API or can be static
                                //discount="20%"

                                location={futsal.location}
                                contact={futsal.contact_number}

                            />
                        ))}
                    </div>
                )}
            </section>
            <section>
                <SwiperComponent />
            </section>
            <section>
                <KhelaSathiMessage />
            </section>
        </>
    )
}

export default HomePages