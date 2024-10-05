import "../css/LandingPage.css"

function LandingPage({ onToggleDisplay }) {
    
    return (
        <div className="lanPage">
            <header>
                <h2>WF Map</h2>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>Services</li>
                        <li>Product</li>
                        <li>About Us</li>
                    </ul>
                </nav>
            </header>

            <section className="info">
                <h1>Community Wildfire Map</h1>
                <p>Stay informed about wildfires around the world</p>
                <button onClick={onToggleDisplay}>Try Now</button>
            </section>           
        </div>
    )
}

export default LandingPage