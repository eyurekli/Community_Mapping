

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





import "../css/Earth.scss"




const Earth = () => {
    const [earthHeight, setEarthHeight] = useState(1200);
    const [earthWidth, setEarthWidth] = useState(2000);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [spinCondition, setSpinCondition] = useState(true)
    const [zoomCount, setZoomCount] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [currGlobeImage, setCurrGlobeImage] = useState(EarthImageDark);

    




    const world = useRef()

    const options = {
        textureQuality: 100,
      };

      const getPolygonCapColor = (coordinates) => {
        return coordinates === hoveredCountry ? "rgba(64,196,250, 0.2)" : "transparent";
    };

    useEffect(() => {
        world.current.controls().enableZoom = false;

        if (hoveredCountry) {
            world.current.controls().autoRotate = false;
        } else {
            world.current.controls().autoRotate = true;
            world.current.controls().autoRotateSpeed = 0.5;
        }
    }, [hoveredCountry]);

    const handleZoomInClick = () => {
        if (!isZooming && zoomCount >= -3 && zoomCount < 3) {
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
    if (!isZooming && zoomCount > -3 && zoomCount <= 3) {
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
      


  return (
    <div className='earth'>
        <div className="earth-options">
            <span onClick={handleZoomInClick}><MdOutlineZoomIn className='icon'/></span>
            <span onClick={handleZoomOutClick}><MdOutlineZoomOut className='icon'/></span>
            <span onClick={handleGlobeImageLight}><MdOutlineLightMode className='icon'/></span>
            <span onClick={handleGlobeImageDark}><MdOutlineDarkMode className='icon'/></span>
           

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
                options={options}
                polygonSideColor={() => `rgba(0, 0, 0, 0)`}
          />
        </div>
        
        
    </div>
  )
}

export default Earth