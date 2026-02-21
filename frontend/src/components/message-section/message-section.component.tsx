import abt1 from "../../assets/images/abt1.jpg"
export default function KhelaSathiMessage() {
    return (
        <div className="p-8 bg-white rounded-lg shadow-md my-8">
            <div className="flex flex-row items-center gap-8">
                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-2xl font-medium text-amber-700 mb-4">Message from KhelaSathi</h2>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                        At KhelaSathi, we believe in the transformative power of sports to build character,
                        foster discipline, and create a healthier society. Our mission is to support athletes
                        at every level of their journey, from beginners taking their first steps into a new sport
                        to professionals competing at the highest levels.
                    </p>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We are committed to providing quality equipment, expert guidance, and unwavering support
                        to help you achieve your sporting goals. Whether you're training for competition or playing
                        for recreation, KhelaSathi stands by your side as a true companion in your sporting journey.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        Join us in celebrating the spirit of sportsmanship and the joy of physical activity.
                        Together, let's create a more active, more connected community through the power of sports.
                    </p>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-amber-700">Rajesh Sharma</h3>
                        <p className="text-sm text-gray-600">Founder & CEO, KhelaSathi</p>
                    </div>
                </div>

                {/* Portrait Image Container */}
                <div className="flex-none w-64 lg:w-72">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg shadow-md overflow-hidden relative">
                        {/* Placeholder image - replace with actual image */}
                        <img
                            src={abt1}
                            alt="KhelaSathi CEO Portrait"
                            className="w-full h-full object-cover"
                        />

                        {/* Optional decorative accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}