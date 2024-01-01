import React from 'react'
import fit_fly_icon from "../Images/Fit&FlyLogo.png";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const fixednavbarStyle = {
        // "position": "fixed",
        // "top": "0px",
        "width": "100%",
        "zIndex": "1",
        "boxShadow": "0px 0px 9px 5px black",
    }

    let location = useLocation();

    let navigateTo = useNavigate();

    React.useEffect(() => {
        // Logging for checking
        // console.log("Getting Location : ",location);
        // console.log("Getting Location Pathname : ",location.pathname);
    }, [location]);

    const logoutUser = () => {
        sessionStorage.removeItem("token");
        navigateTo("/");
        console.log("Signing");
    }

    const aboutUser = () => {
        navigateTo("/user");
    }

    return (

        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={fixednavbarStyle}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><strong>Fit & Fly - ICSS</strong></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item px-lg-2 px-md-1 px-0">
                            <Link className="nav-link text-black" aria-current="page" to="https://www.ganpatuniversity.ac.in/about/about-university">About</Link>
                        </li>
                        <li className="nav-item px-lg-2 px-md-1 px-0">
                            <Link className="nav-link text-black" aria-current="page" to="mailto:fitandfly.sanjay@gmail.com">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
