
import abt from "../../assets/images/abtus.jpg"
import abt1 from "../../assets/images/abt1.jpg"
import abt2 from "../../assets/images/abt2.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faWebAwesome, faWrench } from "@fortawesome/free-solid-svg-icons";

const features = [
    {

        title: 'Premium Facilities',
        description: 'State-of-the-art futsal courts with professional-grade turf and lighting.',
        icon: faWebAwesome
    },
    {

        title: 'Secure Booking',
        description: 'Easy and secure online booking system with instant confirmation.',
        icon: faTrophy
    },
    {

        title: 'Quality Service',
        description: 'Dedicated support team to ensure the best booking experience.',
        icon: faWrench
    },
];
function AboutusPage() {
    return (
        <>


            <div className="w-full px-6 py-8  mt-10">




                <div className="bg-white rounded-lg   overflow-hidden">

                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-medium text-amber-700 mb-4">About KhelaSathi</h1>
                        <p className="text-lg text-gray-600">
                            Your premier destination for futsal court bookings and management.
                        </p>
                    </div>



                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-gray-200 p-6 rounded-lg shadow text-center"
                            >
                                <div className="text-[#FFD700]">
                                    <FontAwesomeIcon icon={feature.icon} size="3x" />
                                </div>


                                <h3 className="text-lg font-medium text-gold-700 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="aspect-w-16 aspect-h-9">
                        <img
                            src={abt}
                            alt="Futsal court"
                            className="w-full h-full object-cover"
                        />
                    </div>


                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-medium text-amber-700 mb-2">Our Story</h2>
                    </div>
                    <div className='p-6 justify-evvenly text-justify'>

                        <p className="text-gray-600 mb-4">
                            Founded in 2024, Futsal Hub has been connecting players with premium futsal facilities across the city. Our mission is to make futsal accessible to everyone, from beginners to experienced players, while providing top-notch facilities and seamless booking experiences. We understand that booking a futsal court should be simple, so we've designed our platform to offer a hassle-free, user-friendly experience that lets you book courts with just a few clicks. Whether you're looking for a casual game with friends or planning a competitive match, Futsal Hub ensures that every booking is straightforward and efficient.
                        </p>
                        <p className="text-gray-600">
                            We partner with the best venues to ensure that every game you play is on a quality court with proper equipment and facilities. From clean, well-maintained courts to state-of-the-art lighting and high-quality futsal balls, we ensure that our venues meet the highest standards. Whether you're a casual player looking for a fun game or part of a regular team needing a reliable spot for practice, we’ve got the perfect court for your needs. Our wide network of partner venues guarantees that no matter where you are in the city, you'll always find a top-tier futsal court close by.
                        </p>

                    </div>

                    <section className="bg-white dark:bg-gray-900">
                        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                            <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                                <h2 className="mb-4 text-4xl tracking-tight font-medium text-amber-700 dark:text-white">Our founder</h2>
                                <p className="mb-4">Khelasathi, a futsal booking platform, was developed and founded by Sushant Paudyal, a final-year student at Islington College. This innovative platform was born out of his passion for sports and his desire to streamline the booking process for futsal enthusiasts. As part of his final-year project, Sushant combined his academic knowledge and technical skills to create a user-friendly solution that makes booking futsal courts quick and easy. His vision for Khelasathi is to provide a seamless experience for players, teams, and venues, helping to foster the growth of futsal in the community.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <img className="w-full rounded-lg" src={abt1} alt="office content 1" />
                                <img className="mt-4 w-full lg:mt-10 rounded-lg" src={abt2} alt="office content 2" />
                            </div>
                        </div>
                    </section>



                </div>

            </div>

        </>
    )
}

export default AboutusPage
