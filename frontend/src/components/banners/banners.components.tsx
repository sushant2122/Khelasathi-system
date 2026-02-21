import { Carousel } from "flowbite-react";
import banner1 from "../../assets/images/banner1.jpg";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.jpg";
import { toast } from "react-toastify";
import bannerSvc from "../../services/banner.service";
import { useEffect, useState } from "react";

export interface Banner {
    id: number;
    title: string;
    link: string;
    image_url: string;
    is_active?: boolean;
}

function BannerComponent() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const listBanner = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bannerSvc.listHomeBanner();
            console.log(response.data.result.list);
            // Filter only active banners if needed

            setBanners(response.data.result.list);
        } catch (err) {
            console.error("Banner fetch error:", err);
            setError("Failed to load banners");
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listBanner();
    }, []);

    // Fallback to local images if no banners are available
    const displayBanners = banners.length > 0 ? banners : [
        { id: 1, image_url: banner1, title: "Fallback Banner 1", link: "#" },
        { id: 2, image_url: banner2, title: "Fallback Banner 2", link: "#" },
        { id: 3, image_url: banner3, title: "Fallback Banner 3", link: "#" }
    ];

    return (
        <section className="w-full">
            <div className="h-52 sm:h-[400px] xl:h-[500px] 2xl:h-[600px] px-0 min-h-[300px] relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-pulse text-gray-500">Loading banners...</div>
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-red-500">{error}</div>
                    </div>
                ) : (
                    <Carousel
                        slideInterval={5000}
                        indicators={displayBanners.length > 1}
                        leftControl={displayBanners.length > 1}
                        rightControl={displayBanners.length > 1}
                    >
                        {displayBanners.map((banner) => (
                            <a
                                key={banner.id}
                                href={banner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={banner.title}
                            >
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </Carousel>
                )}
            </div>
        </section>
    );
}

export default BannerComponent;