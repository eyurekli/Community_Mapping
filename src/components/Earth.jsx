

import React, { useEffect, useRef, useState } from 'react'
import Globe from "react-globe.gl";
import EarthImageDark from "../imgs/earthImage.jpg"
import EarthImageLight from "../imgs/earthImageLight.jpg"
import EarthBumpImage from "../imgs/earthbump.jpg"
import EarthBackground from "../imgs/space.jpg"
import planet from "../imgs/planet.jpg"

import countriesData from "../Data/countries.json";
import * as THREE from "three";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { MdOutlineZoomIn } from "react-icons/md";
import { MdOutlineZoomOut } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { FaVolcano } from "react-icons/fa6";
import { FaPooStorm } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";










import "../css/Earth.scss"

const Earth = () => {
    const [earthHeight, setEarthHeight] = useState(0);
    const [earthWidth, setEarthWidth] = useState(0);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [spinCondition, setSpinCondition] = useState(true)
    const [zoomCount, setZoomCount] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [currGlobeImage, setCurrGlobeImage] = useState(EarthImageDark);
    const world = useRef()
    const [activeDisaster, setActiveDisaster] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [fireEventsData, setFireEventsData] = useState([]);
    const [volcanoData, setVolcanoData] = useState([]);
    const [stormEventsData, setStormEventsData] = useState([]);
    const [selectedFireEvent, setSelectedFireEvent] = useState(null);
    const [dashboardActive, setDashboardActive] = useState(true)
    const [userLocation, setUserLocation] = useState(null);
    const [filteredFireEventsData, setFilteredFireEventsData] = useState([]);
    const [filteredVolcanoData, setFilteredVolcanoData] = useState([]);
    const [filteredStormEventsData, setFilteredStormEventsData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [dots, setDots] = useState('');
    const [selectedCountryPopulation, setSelectedCountryPopulation] = useState("8,180,689,746");


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setDots(prev => (prev.length < 3 ? prev + '.' : ''));
            }, 500);

            return () => clearInterval(interval);
        } else {
            setDots(''); 
        }
    }, [loading]);


    const handleFireEventClick = (fireEvent) => {
        setSelectedFireEvent(fireEvent);
    };

    const handleActiveDisaster = (buttonClass) => {
        setActiveDisaster(buttonClass);
    };

    const handlePolygonClick = (polygon, { lat, lng, altitude }) => {
        setSelectedCountry(polygon.properties.ADMIN)
        setSelectedCountryPopulation(polygon.properties.POP_EST)
    
        if (!loading){
            world.current.pointOfView(
                { lat, lng, altitude: world.current.pointOfView().altitude },
                1000
              );
        }
        

        const countryName = polygon.properties.ADMIN; 

        
        
        
        
        

        setSpinCondition(false)
        
      };

    const [eventsData, setEventsData] = useState([])

    const colorInterpolator = t => `rgba(88, 82, 153,${Math.sqrt(1-t)})`;

    const getVolcanoData = async () => {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/categories/volcanoes');
        const data = await res.json();
        
        const formattedVolcanoData = data.events.flatMap(event =>
            event.geometry.map(geometry => ({
                lat: geometry.coordinates[1], 
                lng: geometry.coordinates[0],
                intensity: Math.random() 
            }))
        );
    
        setVolcanoData(formattedVolcanoData); 
    };
    
    useEffect(() => {
        getVolcanoData();
    }, []);


    const getFireData = async () => {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires'); 
        const data = await res.json();
            
        const formattedFireData = data.events.flatMap(event =>
            event.geometry.map(geometry => ({
                lat: geometry.coordinates[1],
                lng: geometry.coordinates[0], 
                intensity: Math.random() 
            }))
        );
    
        setFireEventsData(formattedFireData); 
    };
    
    useEffect(() => {
        getFireData();
    }, []);

    const getStormData = async () => {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/categories/severeStorms');
        const data = await res.json();
    
        const formattedStormData = data.events.flatMap(event =>
            event.geometry.map(geometry => ({
                lat: geometry.coordinates[1], 
                lng: geometry.coordinates[0],
                maxR: Math.random() * 5 + 3, 
                propagationSpeed: (Math.random() - 0.5) * 20 + 1, 
                repeatPeriod: Math.random() * 2000 + 200 
            }))
        );
    
        setStormEventsData(formattedStormData);
    };

    useEffect(() => {
        getStormData();
    }, []);

    


    
    
   
   

    useEffect(() => {
        const updateDimensions = () => {
            setEarthHeight(window.innerHeight);
            setEarthWidth(window.innerWidth); 
        };

        updateDimensions();

        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);


    const N = 10;
    const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        maxR: Math.random() * 20 + 3,
        propagationSpeed: (Math.random() - 0.5) * 20 + 1,
        repeatPeriod: Math.random() * 2000 + 200
    }));
    

    const options = {
        textureQuality: 100,
      };

      const getPolygonCapColor = (coordinates) => {
        if (coordinates.properties.ADMIN.includes(selectedCountry))
            return "rgba(82, 121, 249, 0.3)"; 

        return coordinates === hoveredCountry ? "rgba(64,196,250, 0.2)" : "transparent";
    };

    useEffect(() => {
        if (!loading){
            world.current.controls().enableZoom = false;
        }


        if (spinCondition && !loading){

            if (hoveredCountry) {
                world.current.controls().autoRotate = false;
            } else {
                world.current.controls().autoRotate = true;
                world.current.controls().autoRotateSpeed = 1;
            }
        }
        
    }, [hoveredCountry]);

    const extractCountryFromTitle = (title) => {
        const parts = title.split(" in ");
        return parts.length > 1 ? parts[1] : null; 
    };

    const handleZoomInClick = () => {
        if (!isZooming && zoomCount >= -6 && zoomCount < 6) {
          setIsZooming(true);

          if (!loading){
            world.current.pointOfView(
                { altitude: world.current.pointOfView().altitude - 0.35 },
                500
              );
          }
          
          setZoomCount(zoomCount + 1);
          setTimeout(() => {
            setIsZooming(false);
          }, 200);
        }
        
    };

    const handleZoomOutClick = () => {
    if (!isZooming && zoomCount > -6 && zoomCount <= 6) {
        setIsZooming(true);

        if (!loading){
            world.current.pointOfView(
            { altitude: world.current.pointOfView().altitude + 0.35 },
            500
            );
        }
        setZoomCount(zoomCount - 1);
        setTimeout(() => {
        setIsZooming(false);
        }, 200);
    }
    
    };

    const handleGlobeImageDark = () => {
        setCurrGlobeImage(EarthImageDark); 
    }

    const handleGlobeImageLight = () => {
        setCurrGlobeImage("https://unpkg.com/three-globe@2.30.3/example/img/earth-blue-marble.jpg");   
    }
    
    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = 'Latitude: ' + latitude + ' Longitude: '+ longitude;
                    console.log(location);
                    setUserLocation("Location Found!");

                    world.current.pointOfView(
                        { lat: latitude, lng: longitude, altitude: 0.3 },
                        1000
                      );

                },
                (error) => {
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };


    const handleDashboard = () => {
        setDashboardActive(!dashboardActive)
        console.log("widhaiwbduwia");
    }

    const handleWorldwide = () => {
        setSelectedCountry(null);
        setSelectedCountryPopulation("8,180,689,746");
    }

    

  return (
    <div className='earth'>

        {loading ? (
            <div className="loader">
                <img src={planet}/>
                <h1>Fetching Data{dots}</h1>
            </div>
        ) : (
            <>
        {dashboardActive && (
            <div className="dashboard">
                <span className='x-button' onClick={handleDashboard}>
                    <IoCloseSharp className='icon' />
                </span>
                
                <div className="dashboard-content">
                    <div className="selectedCountry">
                        <h1>Active Country</h1>
                        <h2>{selectedCountry ? selectedCountry : 'Worldwide'}</h2>
                        <h2>Population: <span>{selectedCountryPopulation}</span></h2>
                    </div>

                    {selectedCountry && <button onClick={handleWorldwide}>Worldwide</button>}

                    <div className="disaster-options">
                        <span onClick={() => handleActiveDisaster('fire')}>
                            <FaFire className={`icon ${activeDisaster === 'fire' ? 'fire' : ''}`} />
                        </span>
                        <span onClick={() => handleActiveDisaster('volcano')}>
                            <FaVolcano className={`icon ${activeDisaster === 'volcano' ? 'volcano' : ''}`} />
                        </span>
                        <span onClick={() => handleActiveDisaster('storm')}>
                            <FaPooStorm className={`icon ${activeDisaster === 'storm' ? 'storm' : ''}`} />
                        </span>
                    </div>
                </div>
            </div>
        )}
        
        <div className="earth-options">
            <div className="disaster-options">
            </div>

            <div className="earth-buttons">
                <span onClick={handleZoomInClick}><MdOutlineZoomIn className='icon' /></span>
                <span onClick={handleZoomOutClick}><MdOutlineZoomOut className='icon' /></span>
                <span onClick={handleGlobeImageLight}><MdOutlineLightMode className='icon' /></span>
                <span onClick={handleGlobeImageDark}><MdOutlineDarkMode className='icon' /></span>
                <span onClick={handleLocation}><MdOutlineLocationOn className='icon' /></span>
                <span onClick={handleDashboard}><MdDashboard className='icon' /></span>
            </div>
        </div>

        <div className="earth-container">
            <Globe
                ref={world}
                className={`earth ${hoveredCountry != null ? 'hovered-country' : ''}`}             
                height={earthHeight}
                width={earthWidth}
                atmosphereColor={"white"}
                globeImageUrl={currGlobeImage}
                showGraticules={false}
                polygonsData={countriesData.features}
                polygonStrokeColor={(coordinates) =>
                    coordinates === hoveredCountry
                    ? `rgba(255, 255, 255, 0.8)`
                    : `rgba(255, 255, 255, 0.2)`
                }
                polygonCapColor={getPolygonCapColor}
                htmlAltitude='altitude'
                onPolygonHover={(country) => {
                    setHoveredCountry(country);
                }}
                polygonAltitude={(coordinates) =>
                    coordinates === hoveredCountry ? 0.02 : 0.01
                }
                backgroundColor={"#FF000000"}
                polygonLabel={({ properties: coordinates }) => {
                    return `<b>${coordinates.ADMIN} (${coordinates.ISO_A2})</b>`;
                }}
                onPolygonClick={(polygon, event, { lat, lng, altitude }) => {
                    handlePolygonClick(polygon, { lat, lng, altitude });
                }}
                options={options}
                polygonSideColor={() => `rgba(0, 0, 0, 0)`}
                
                pointsData={
                    selectedCountry === null 
                    ? activeDisaster === 'fire' ? fireEventsData : 
                    activeDisaster === 'volcano' ? volcanoData : []
                    : activeDisaster === 'fire' ? filteredFireEventsData : 
                    activeDisaster === 'volcano' ? filteredVolcanoData : []
                }
                pointLat={(d) => d.lat}
                pointLng={(d) => d.lng}
                pointColor={(d) => `rgba(255, 69, 0, ${Math.min(d.intensity + 0.3, 1)})`} 
                pointAltitude={() => 0.015} 
                pointRadius={0.4}
                pointsMerge={false} 
                onPointClick={(point, event, { lat, lng, altitude }) => {
                    console.log('Point clicked:', point);
                    console.log('Coordinates:', { lat, lng, altitude });
                    
                }}
                ringsData={activeDisaster === 'storm' ? stormEventsData : []} 
                ringColor={() => colorInterpolator}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
            />
        </div>
    </>
)}

            
        
        

        
        
    </div>
  )
}

export default Earth