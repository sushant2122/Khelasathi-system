import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import espn from "../../assets/images/espn.png"
import fifa from "../../assets/images/fifa.png"
import unilever from "../../assets/images/eslint.config.jpg"
import afc from "../../assets/images/afc.jpeg"
import worldlink from "../../assets/images/worldlink.jpg"
import nft from "../../assets/images/NFT.png"
const clientsData = [
    {
        id: 1,
        name: "AFC",
        logo: afc
    },
    {
        id: 2,
        name: "FIFA",
        logo: fifa
    },
    {
        id: 3,
        name: "WorldLink",
        logo: worldlink
    },
    {
        id: 4,
        name: "Unilever",
        logo: unilever
    },
    {
        id: 5,
        name: "ESPN",
        logo: espn
    },
    {
        id: 6,
        name: "National Football Team",
        logo: nft
    },

];

export default function SwiperComponent() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);
    const carouselRef = useRef(null);

    const visibleItems = 5; // Number of items visible at once
    const maxIndex = clientsData.length - visibleItems;

    // Auto scroll functionality
    useEffect(() => {
        let interval: any;

        if (isAutoplay) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex >= maxIndex ? 0 : prevIndex + 1
                );
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [isAutoplay, maxIndex]);

    const handlePrev = () => {
        setIsAutoplay(false);
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );
    };

    const handleNext = () => {
        setIsAutoplay(false);
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const handleMouseEnter = () => setIsAutoplay(false);
    const handleMouseLeave = () => setIsAutoplay(true);

    return (
        <div className="w-full mx-auto px-4 py-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-amber-700">Our Sponsors</h2>

            </div>

            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="overflow-hidden px-10">
                    <div
                        ref={carouselRef}
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 20}%)` }}
                    >
                        {clientsData.map((client) => (
                            <div key={client.id} className="w-1/5 flex-shrink-0 px-4">
                                <div className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32 w-32 mx-auto border border-gray-200">
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="max-h-24 max-w-24 rounded-full object-contain"
                                    />
                                </div>
                                <p className="text-center mt-3 text-sm text-gray-600">{client.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(clientsData.length / visibleItems) }).map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 rounded-full focus:outline-none ${Math.floor(currentIndex / visibleItems) === index
                            ? 'w-6 bg-blue-600'
                            : 'w-2 bg-gray-300'
                            }`}
                        onClick={() => {
                            setIsAutoplay(false);
                            setCurrentIndex(index * visibleItems);
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}