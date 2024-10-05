

import React, { useState } from 'react'
import Globe from "react-globe.gl";
import EarthImage from "../imgs/earthImage.jpg"
import EarthBumpImage from "../imgs/earthbump.jpg"

import countriesData from "../Data/countries.json";




const Earth = () => {
    const [earthHeight, setEarthHeight] = useState(800);
    const [earthWidth, setEarthWidth] = useState(800);


  return (
    <div>
        <Globe
            Globe className='globe' 
            height={earthHeight}
            width={earthWidth}
            backgroundColor='#101827'
            atmosphereColor={() => 'rgba(0,0,0,0.2)'}
            globeImageUrl={EarthImage}
            showGraticules={true}
            polygonsData={countriesData.features}
            polygonStrokeColor={() => 'black'}
  
            htmlAltitude='altitude'
  
      
          />
        
    </div>
  )
}

export default Earth