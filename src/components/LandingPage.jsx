import "../css/LandingPage.css"

// eslint-disable-next-line react/prop-types
function LandingPage({ onToggleDisplay }) {
    
    const logUserCoordinates = () => {
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
        <div className="lanPage">
            <header>
                <h2>Natural Disaster Visualizer</h2>
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
                <h1>World Natural Disaster Visualizer</h1>
                <p>Stay informed about disasters around the world and your community</p>
                <div id="buttons">
                    <button onClick={onToggleDisplay}>Try Now</button>
                    <button onClick={logUserCoordinates}>Dangers Around Me</button>
                </div>
            </section>       
                
        </div>
    )
}

export default LandingPage