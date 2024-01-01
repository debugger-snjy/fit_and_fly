import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext'
import NavBreadcrumb from '../NavBreadcrumb';
import InternalMenuBar from '../InternalMenuBar';

// Images
import wishlistsIcon from "../../Images/wishlist.png";
import ordersIcon from "../../Images/orders.png";
import addressIcon from "../../Images/address.png";
import cartIcon from "../../Images/cart.png";
import accountBalanceOkIcon from "../../Images/HappyWalletFinal.png";
import accountBalanceLowIcon from "../../Images/SadWalletFinal.png";

function CustomerDashboard() {

    // Badge Style : 
    let badgeStyle = {
        "position": "absolute",
        "top": "5px",
        "right": "5px",
        "padding": "5px 16px",
        "color": "aliceblue",
    }

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [CategoryRecords, setCategoryRecords] = useState([])
    const [UserData, setUserData] = useState([])

    useEffect(() => {
        if (sessionStorage.getItem("role").toString() !== "customer") {
            navigateTo("/error_page")
        }

        FetchCategoryAPI();
        FetchUserDetails();

    }, [])

    if (sessionStorage.getItem("user") == "" || sessionStorage.getItem("token") == "") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    const FetchUserDetails = async () => {
        // Calling the Add Category API
        const response = await fetch(`http://localhost:5000/api/auth/getuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token"),
            }
        });

        // Variable to handle the API Response
        const userDetailsResponse = await response.json()

        console.log(userDetailsResponse)

        setUserData(userDetailsResponse.user)
    }

    // Function to Fetch the Category Data in the Database
    const FetchCategoryAPI = async () => {
        // Calling the Add Category API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allcategories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchCategoriesResponse = await response.json()

        console.log(fetchCategoriesResponse)

        setCategoryRecords(fetchCategoriesResponse.categories)
    }

    const DepositMoneyAPI = async (event) => {

        event.preventDefault();

        const amountToDeposit = parseFloat(document.getElementById("DepositMoney").value);
        document.getElementById("DepositMoney").value = ""

        const depositAmountAPICall = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/deposit/money`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                "amount": amountToDeposit,
            })
        })

        const depositAmountResponse = await depositAmountAPICall.json();

        contextData.showAlert(depositAmountResponse.status[0].toUpperCase() + depositAmountResponse.status.slice(1), depositAmountResponse.msg, depositAmountResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchUserDetails()
    }


    const WithdrawMoneyAPI = async (event) => {

        event.preventDefault();

        const amountToWithdraw = parseFloat(document.getElementById("WithdrawMoney").value);
        document.getElementById("WithdrawMoney").value = ""

        const withdrawAmountAPICall = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/withdraw/money`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                "amount": amountToWithdraw,
            })
        })

        const withdrawAmountResponse = await withdrawAmountAPICall.json();
        console.log(withdrawAmountResponse)

        contextData.showAlert(withdrawAmountResponse.status[0].toUpperCase() + withdrawAmountResponse.status.slice(1), withdrawAmountResponse.msg, withdrawAmountResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchUserDetails()
    }

    const updateAddress = async (event) => {

        event.preventDefault();
        const addressToUpdate = document.getElementById("UpdateAddress").value;
        document.getElementById("UpdateAddress").value = ""

        const updateAddressAPICall = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/update/address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                address: addressToUpdate,
            })
        })

        const updateAddressResponse = await updateAddressAPICall.json();
        console.log(updateAddressResponse)

        contextData.showAlert(updateAddressResponse.status[0].toUpperCase() + updateAddressResponse.status.slice(1), updateAddressResponse.msg, updateAddressResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchUserDetails()

    }

    // Function to open the category Section : 
    const openCategoryItems = (categoryname) => {
        navigateTo(`${location.pathname}/category/${categoryname.toLowerCase()}`)
    }

    const openWishlists = () => {
        navigateTo(`${location.pathname}/wishlists`)
    }

    const openCarts = () => {
        navigateTo(`${location.pathname}/carts`)
    }

    const openOrders = () => {
        navigateTo(`${location.pathname}/orders`)
    }

    return (

        <>
            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrSeparator' />
            </div>

            <NavBreadcrumb />

            <div className="row my-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {CategoryRecords.length === 0 ? <h3>Sorry for Inconvience, No Items are for Selling !</h3> : ""}
                        {
                            CategoryRecords.map((category, index) => {

                                const keys = Object.keys(category);
                                console.log(category)

                                return (

                                    <React.Fragment key={category._id}>
                                        {/* Category Card */}
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2" key={category._id}>
                                            <div className="card itemCard" onClick={() => { openCategoryItems(category.categoryName) }}>
                                                <img src={`/Categories/${category.categoryImageLocation}`} className="card-img-top itemImg" alt="Materials" />
                                                <div className="card-body">
                                                    <p className="card-text itemName">{category.categoryName}</p>
                                                </div>
                                                {/* <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editCategoryModel" onClick={() => { setEditCategoryRecord(category) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Category</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCategoryAPI(category._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Category</button></div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }

                    </div>
                </div>
            </div>

            <div className="my-4">
                <hr className='hrSeparator' style={{ "height": "2px" }} />
            </div>

            <div className="row my-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openCarts}>
                                <img src={cartIcon} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Your Cart</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openOrders}>
                                <img src={ordersIcon} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Your Orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openWishlists}>
                                <img src={wishlistsIcon} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Your Wishlist</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" data-bs-toggle="modal" data-bs-target={`#AddressInfo`}>
                                <img src={addressIcon} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Your Address</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" id="accountBalance" data-bs-toggle="modal" data-bs-target={`#AccountBalanceInfo`}>
                                {parseFloat(JSON.parse(sessionStorage.getItem("user")).account_balance) < 2000 && <span className="bg-danger badge badge-danger" style={badgeStyle}>Low Balance</span>}
                                <img src={parseFloat(JSON.parse(sessionStorage.getItem("user")).account_balance) >= 2000 ? accountBalanceOkIcon : accountBalanceLowIcon} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Account Balance</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Balance Modal */}
                        <div className="modal fade dark-modal" id={`AccountBalanceInfo`} tabIndex="-1" aria-labelledby={`AccountBalanceInfoLabel`} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id={`CancelOrderFormLabel`}>Account Balance Info</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addOrdercloseBtn" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p htmlFor="orderCancelMsg" className="fs-5 fw-semibold">Account User Name : <span className='fw-bold'>{UserData.name}</span></p>
                                        <p htmlFor="orderCancelMsg" className="fs-5 fw-semibold">Current Balance : <span className='fw-bold'>₹ {UserData.account_balance ? UserData.account_balance.toFixed(2) : UserData.account_balance}</span></p>

                                        <hr className='mb-4 mt-2' style={{ opacity: "1", backgroundColor: "white", height: "4px" }} />

                                        <label htmlFor="depositMoney" className="form-label">Deposit Money To Your Fit&FLy Account :</label>
                                        <div className="row align-items-end">
                                            <div className="col-8">
                                                <input type="number" className="form-control" id="DepositMoney" placeholder="Enter amount to deposit" />
                                            </div>
                                            <div className="col-4">
                                                <div className="btn w-100 btn-success" onClick={DepositMoneyAPI}>Deposit Money</div>
                                            </div>
                                        </div>

                                        <hr />
                                        <label htmlFor="depositMoney" className="form-label">Withdraw Money From Your Fit&FLy Account :</label>
                                        <div className="row align-items-end">
                                            <div className="col-8">
                                                <input type="number" className="form-control" id="WithdrawMoney" placeholder="Enter amount to withdraw" />
                                            </div>
                                            <div className="col-4">
                                                <div className="btn w-100 btn-danger" onClick={WithdrawMoneyAPI}>Withdraw Money</div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="modal-footer bg-dark">
                                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Update Address Modal */}
                        <div className="modal fade dark-modal" id={`AddressInfo`} tabIndex="-1" aria-labelledby={`AddressInfoLabel`} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-xl">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id={`CancelOrderFormLabel`}>Address Info</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addOrdercloseBtn" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p htmlFor="orderCancelMsg" className="fs-5 fw-semibold">Account User Name : <span className='fw-bold'>{UserData.name}</span></p>
                                        <p htmlFor="orderCancelMsg" className="fs-5 fw-semibold">Your Current Address : <span className='fw-bold'>{UserData.address}</span></p>

                                        <hr className='mb-4 mt-2' style={{ opacity: "1", backgroundColor: "white", height: "4px" }} />

                                        <label htmlFor="depositMoney" className="form-label">Update Your Address to New Address : </label>
                                        <div className="row align-items-center mt-1">
                                            <div className="col">
                                                <textarea className="form-control" id="UpdateAddress" rows="5" placeholder="Enter your new Address to Update" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-dark">
                                        <button type="button" className="btn btn-success align-center" onClick={updateAddress}>Update Address</button>
                                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close !</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default CustomerDashboard
