

import React, { useEffect, useRef, useState } from 'react'
import Globe from "react-globe.gl";
import EarthImageDark from "../imgs/earthImage.jpg"
import EarthImageLight from "../imgs/earthImageLight.jpg"
import EarthBumpImage from "../imgs/earthbump.jpg"
import EarthBackground from "../imgs/space.jpg"
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
    

    const handleActiveDisaster = (buttonClass) => {
        setActiveDisaster(buttonClass);
    };

    const handlePolygonClick = (polygon, { lat, lng, altitude }) => {
        setSelectedCountry(polygon.properties.ADMIN)
    
        world.current.pointOfView(
          { lat, lng, altitude: world.current.pointOfView().altitude },
          1000
        );

        setSpinCondition(false)
        
      };

    const [eventsData, setEventsData] = useState([])

    const colorInterpolator = t => `rgba(255,100,50,${Math.sqrt(1-t)})`;


    const getData = async () => { 
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events')
        const data = await res.json()
        setEventsData(data.events)
        console.log(data)
    }

    useEffect(() => {
        getData();
    },[])

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
        world.current.controls().enableZoom = false;


        if (spinCondition){

            if (hoveredCountry) {
                world.current.controls().autoRotate = false;
            } else {
                world.current.controls().autoRotate = true;
                world.current.controls().autoRotateSpeed = 1;
            }
        }
        
    }, [hoveredCountry]);

    const handleZoomInClick = () => {
        if (!isZooming && zoomCount >= -4 && zoomCount < 4) {
          setIsZooming(true);
          world.current.pointOfView(
            { altitude: world.current.pointOfView().altitude - 0.35 },
            500
          );
          setZoomCount(zoomCount + 1);
          setTimeout(() => {
            setIsZooming(false);
          }, 200);
        }
        
    };

    const handleZoomOutClick = () => {
    if (!isZooming && zoomCount > -4 && zoomCount <= 4) {
        setIsZooming(true);
        world.current.pointOfView(
        { altitude: world.current.pointOfView().altitude + 0.35 },
        500
        );
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
                    console.log('Latitude:', latitude, 'Longitude:', longitude);
                },
                (error) => {
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };


  return (
    <div className='earth'>
        <div className="earth-options">
            <div className="disaster-options">
            <span 
                onClick={() => handleActiveDisaster('fire')}
            >
                <FaFire className={`icon ${activeDisaster === 'fire' ? 'fire' : ''}`}  />
            </span>
            <span 
                onClick={() => handleActiveDisaster('volcano')}
            >
                <FaVolcano  className={`icon ${activeDisaster === 'volcano' ? 'volcano' : ''}`}/>
            </span>
            <span 
                onClick={() => handleActiveDisaster('storm')}
            >
                <FaPooStorm className={`icon ${activeDisaster === 'storm' ? 'storm' : ''}`} />
            </span>
        </div>

            <div className="earth-buttons">
                <span onClick={handleZoomInClick}><MdOutlineZoomIn className='icon'/></span>
                <span onClick={handleZoomOutClick}><MdOutlineZoomOut className='icon'/></span>
                <span onClick={handleGlobeImageLight}><MdOutlineLightMode className='icon'/></span>
                <span onClick={handleGlobeImageDark}><MdOutlineDarkMode className='icon'/></span>
                <span onClick={handleLocation}><MdOutlineLocationOn className='icon'/></span>
            </div>
           

        </div>

        <div className="earth-container">
            

            <Globe
                ref = {world}
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
                
          />
        </div>
        
        
    </div>
  )
}

export default Earth