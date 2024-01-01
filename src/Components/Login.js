import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import fit_fly_icon from "../Images/Fit&FlyLogo.png";
import "../CSS/style.css"
import MyContext from '../Context/MyContext';

function Login() {

    let navigateTo = useNavigate()

    // Using the function to get the data from the context
    const contextData = useContext(MyContext);

    console.log("Hello Login");

    useEffect(() => {
        const role = sessionStorage.getItem("role")
        if (sessionStorage.getItem("token")) {
            navigateTo(`/dashboard/${role}`)
        }
    })

    // Calling the API to get the User Info : 
    const getInfoAPI = async (token) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`http://localhost:5000/api/auth/getuser`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        // Variable to handle the API Response
        const userData = await response.json()

        console.log(userData)

        // Sending the response Data
        return userData
    }

    // Calling the API to login the User : 
    const loginAPI = async (useremail, userpassword, userrole) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify({ email: useremail, password: userpassword, role: userrole })
        });

        // Variable to handle the API Response
        const loginResponse = await response.json()

        console.log(loginResponse)

        // Sending the response Data
        return loginResponse
    }

    // Function to handle when user gets logged in !
    const handleLogin = async (event) => {

        console.log("Login Submit !");

        event.preventDefault();

        let useremail = document.getElementById("userEmail").value;
        console.log(useremail);
        let userpassword = document.getElementById("userPassword").value;
        console.log(userpassword);
        let userrole = document.getElementById("userRole").value;
        console.log(userrole)


        // Adding the API Call to add the notes into the Database
        const response = await loginAPI(useremail, userpassword, userrole)

        // If the user is registered and we get its auth-token,
        // Then we will save that auth-token in the sessionStorage
        if (response.status === "success") {

            // Showing the Alert Message
            contextData.showAlert("Success", response.msg, "alert-success")

            // Getting the User Info :
            const getuserResponse = await getInfoAPI(response.authToken)

            console.log("Hii", getuserResponse)

            // Showing the Alert Box for the Fetching the Data
            contextData.showAlert("Fetching", "Fetching the User Data", "alert-warning")

            setTimeout(() => {

                // Saving auth-token in sessionStorage
                sessionStorage.setItem("token", response.authToken)
                sessionStorage.setItem("role", userrole)
                sessionStorage.setItem("user", JSON.stringify(getuserResponse.user))

                // Showing the Alert Box for the successfull fetching the user data
                contextData.showAlert("Success", getuserResponse.msg, "alert-success")

                navigateTo(`/dashboard/${userrole}`)

            }, 3000);

        }

        else {

            // Showing the Alert Message
            contextData.showAlert("Failed", response.msg, "alert-danger")

            // // Setting the status message :
            // document.getElementById("status").innerText = userToken.msg
            // document.getElementById("status").style.color = "red"
            // document.getElementById("status").style.fontWeight = 600;
        }

    }

    return (
        <>
            <div className='loginPage mb-5'>

                <div className="container-fluid mb-5">
                    <div className="row align-items-center">
                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6 text-center px-0">
                            <img src={fit_fly_icon} width={"400px"} alt="Website Logo" className='logoImg' />
                            <div className="fs-5 fw-bold text-uppercase text-center text-white mt-4 designedFont mx-4">"Step into your personal style haven with Fit & Fly"</div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6 text-center px-0">
                            <div className="loginForm text-white">

                                <hr className='hrStyle container-fluid ' />

                                <div className="fs-5 fw-bold text-center">Unlock your fashionista potential with curated trends, simplify your shopping journey, and indulge in exclusive treats - all just a login away.</div>

                                <form>
                                    <div className="my-4 mx-4">
                                        <input type="email" className="form-control focus-ring inputField px-3" id="userEmail" placeholder="Email Address" />
                                    </div>
                                    <div className="my-4 mx-4">
                                        <input type="password" className="form-control focus-ring inputField px-3" id="userPassword" placeholder="Password" />
                                    </div>
                                    <div className="my-4 mx-4">
                                        <center>
                                            <select className="form-select inputField px-3" id='userRole' defaultValue={"customer"} style={{ width: "100%" }}>
                                                <option value="customer" defaultChecked>Customer</option>
                                                <option value="employee">Employee</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </center>
                                    </div>

                                    <button className='btn btn-primary centerIt loginBtn' onClick={handleLogin} >Log in</button>

                                </form>

                                <div className="container mt-4 myLoginLink fw-bold">
                                    <center>
                                        Don't have Account, <a href={`/signup`}>Sign up</a>
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login