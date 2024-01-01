import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import fit_fly_icon from "../Images/Fit&FlyLogo.png";
import "../CSS/style.css"
import MyContext from '../Context/MyContext';

function Signup() {

    let navigateTo = useNavigate()

    // Using the function to get the data from the context
    const contextData = useContext(MyContext);

    console.log("Hello Signup");

    useEffect(() => {
        const role = sessionStorage.getItem("role")
        if (sessionStorage.getItem("token")) {
            navigateTo(`/dashboard/${role}`)
        }
    })

    // Calling the API to login the User : 
    const signUpAPI = async (userEmail, userPassword, userName, userPhone, userAddress, usergender, userrole) => {

        // API Call to fetch user data :
        // Adding the API Call to fetch the user from the Database
        const signUpAPI = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST", // As fetchallnotes is a GET method

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify({ email : userEmail, password : userPassword, name : userName, phone : userPhone, address : userAddress, gender : usergender, role : userrole, account_balance : 0 })
        });

        // Variable to handle the API Response
        const signupResponse = await signUpAPI.json()

        console.log(signupResponse)

        // Sending the response Data
        return signupResponse
    }

    // Function to handle when user gets logged in !
    const handleSignup = async (event) => {

        console.log("Signup Submit !");

        event.preventDefault();

        let userEmail = document.getElementById("userEmail").value;
        let userPassword = document.getElementById("userPassword").value;
        let userName = document.getElementById("userName").value;
        let userPhone = document.getElementById("userPhone").value;
        let userAddress = document.getElementById("userAddress").value;
        const usergender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderFemale").checked ? "female" : "";
        const userrole = "customer"

        // Adding the API Call to add the notes into the Database
        const response = await signUpAPI(userEmail, userPassword, userName, userPhone, userAddress, usergender, userrole)

        // If the user is registered and we get its auth-token,
        // Then we will save that auth-token in the sessionStorage
        if (response.status === "success") {

            // Showing the Alert Message
            contextData.showAlert("Success", response.msg, "alert-success")

            // console.log("Hii", getuserResponse)

            // Showing the Alert Box for the Fetching the Data
            contextData.showAlert("Fetching", "Fetching the User Data", "alert-warning")

            setTimeout(() => {

                // Saving auth-token in sessionStorage
                sessionStorage.setItem("token", response.authToken)
                sessionStorage.setItem("role", userrole)
                sessionStorage.setItem("user", JSON.stringify(response.userData))

                // Showing the Alert Box for the successfull fetching the user data
                // contextData.showAlert("Success", getuserResponse.msg, "alert-success")

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
                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6 px-0">
                            <div className="loginForm text-white">

                                <hr className='hrStyle container-fluid ' />

                                <div className="fs-5 fw-bold text-center">Welcome to the start of your style transformation with Fit & Fly! Let's find your wings.</div>

                                <hr />

                                <div className="my-3 mx-3 menutextStyle">Enter the Fields to create your Account</div>

                                <form>
                                    <div className="mb-3 mx-4">
                                        <div class="form-group">
                                            <input type="email" className="form-control focus-ring inputField mb-1" name="userEmail" id="userEmail" placeholder="Email Address" />
                                        </div>
                                    </div>
                                    <div className="mb-3 mx-4">
                                        <div class="form-group">
                                            <input type="email" className="form-control focus-ring inputField mb-1" name="userPassword" id="userPassword" placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="mb-3 mx-4">
                                        <div class="form-group">
                                            <input type="email" className="form-control focus-ring inputField mb-1" name="userName" id="userName" placeholder="Name" />
                                        </div>
                                    </div>
                                    <div className="mb-3 mx-4">
                                        <div class="form-group">
                                            <input type="email" className="form-control focus-ring inputField mb-1" name="userPhone" id="userPhone" placeholder="Phone" />
                                        </div>
                                    </div>
                                    <div className="mb-3 mx-4">
                                        <div class="form-group">
                                            <input type="email" className="form-control focus-ring inputField mb-1" name="userAddress" id="userAddress" placeholder="Address" />
                                        </div>
                                    </div>
                                    <div className="mb-3 mx-4">
                                        <label htmlFor="userEmail" className='menutextStyle fs-5 mb-1'>Gender</label>

                                        <div className="form-check mx-3">
                                            <input className="form-check-input" type="radio" name="usergender" id="genderMale" />
                                            <label className="form-check-label menutextStyle" htmlFor="genderMale">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check mx-3">
                                            <input className="form-check-input" type="radio" name="usergender" id="genderFemale" />
                                            <label className="form-check-label menutextStyle" htmlFor="genderFemale">
                                                Female
                                            </label>
                                        </div>
                                    </div>

                                    <button className='btn btn-primary centerIt loginBtn' onClick={handleSignup} >Sign Up</button>

                                </form>

                                <div className="container mt-4 mySignupLink fw-bold">
                                    <center>
                                        Already Have an Account, <a href='/'>Log in</a>
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

export default Signup