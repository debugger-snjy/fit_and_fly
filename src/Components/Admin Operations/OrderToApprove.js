import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';

import orderPending from "../../Images/orderPending.png"
import approved from "../../Images/approved.png"
import rejected from "../../Images/rejected.png"

function OrderToApprove() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [AllOrdersRecords, setAllOrdersRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])

    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("token") || !sessionStorage.getItem("role") === "admin") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        // Checking for the session storage items
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        // Adding this in the recent Accessed
        // contextData.updateRecentlyAccessed('AllOrders Operations', `${location.pathname}`);

        FetchAllOrdersAPI();

    }, [])

    // Function to Fetch the AllOrders Data in the Database
    const FetchAllOrdersAPI = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allorders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllOrders = await response.json()

        console.log(fetchAllOrders)

        setAllOrdersRecords(fetchAllOrders.orders)
    }

    const ApproveOrder = async (event, orderID) => {

        event.preventDefault();

        const orderArrivalTime = parseInt(document.getElementById("arrivalTime").value)

        // Calling the Add AllOrders API
        const approveResponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/approve/order/${orderID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                arrivalTime: orderArrivalTime
            })
        });

        // Variable to handle the API Response
        const fetchApproveResponse = await approveResponse.json()

        console.log(fetchApproveResponse)

        contextData.showAlert(fetchApproveResponse.status, fetchApproveResponse.msg, fetchApproveResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchAllOrdersAPI()

    }

    const DisapproveOrder = async (event, orderID) => {

        event.preventDefault();

        // Calling the Add AllOrders API
        const disapproveResponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/disapprove/order/${orderID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            }
        });

        // Variable to handle the API Response
        const fetchDisapproveResponse = await disapproveResponse.json()

        console.log(fetchDisapproveResponse)

        contextData.showAlert(fetchDisapproveResponse.status, fetchDisapproveResponse.msg, fetchDisapproveResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchAllOrdersAPI()

    }

    const applyFilter = () => {

        const searchAllOrdersID = document.getElementById("filterAllOrdersID").value;
        const searchName = document.getElementById("filterName").value;
        const searchDept = document.getElementById("filterDept").value;
        const searchShortForm = document.getElementById("filterShortForm").value;
        const searchCabinLocation = document.getElementById("filterCabinLocation").value;
        const searchDesignation = document.getElementById("filterDesignation").value;

        let orderIdMatches;
        let nameMatches;
        let deptMatches;
        let shortFormMatches;
        let cabinLocationMatches;
        let designationMatches;

        const filteredResult = AllOrdersRecords.filter((item) => {
            if (searchAllOrdersID !== "") {
                orderIdMatches = item.orderId.toString() === searchAllOrdersID || searchAllOrdersID === '';

            }
            if (searchName !== "") {
                nameMatches = item.name.includes(searchName)
            }
            if (searchShortForm !== "") {
                shortFormMatches = item.orderShortForm.includes(searchShortForm)
            }
            if (searchDept !== "") {
                deptMatches = item.dept.includes(searchDept);
            }
            if (searchDesignation !== "") {
                designationMatches = item.designation.includes(searchDesignation);
            }
            if (searchCabinLocation !== "") {
                cabinLocationMatches = item.cabinLocation.includes(searchCabinLocation)
            }

            return (orderIdMatches || searchAllOrdersID === "") && (nameMatches || searchName === "") && (deptMatches || searchDept === "") && (shortFormMatches || searchShortForm === "") && (cabinLocationMatches || searchCabinLocation === "") && (designationMatches || searchDesignation === "");
        });

        setFilteredRecords(filteredResult)
    }

    const clearAllFilters = () => {
        document.getElementById("filterForm").reset()
        setFilteredRecords([])
    }

    return (
        <>

            {/* Adding the internal Menu Bar */}
            <InternalMenuBar />

            {/* Ading all the other Operations */}
            <div className="my-4">
                <hr className='hrStyle' />
            </div>

            <NavBreadcrumb />

            {/* Filter Section */}
            <div className="my-2">
                <div id='filterContainer' className='bg-light p-3 m-2 mt-4' style={{ borderRadius: "10px" }}>
                    <form id='filterForm'>
                        <div className="row justify-content-center">
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterAllOrdersID" className="form-label text-black fw-bold">AllOrders ID</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterAllOrdersID" name="filterAllOrdersID" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDept" className="form-label text-black fw-bold">Department</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDept" name="filterDept" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterShortForm" className="form-label text-black fw-bold">AllOrders Short Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterShortForm" name="filterShortForm" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterCabinLocation" className="form-label text-black fw-bold">Cabin Location</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterCabinLocation" name="filterCabinLocation" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDesignation" className="form-label text-black fw-bold">Designation</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDesignation" name="filterDesignation" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3 text-center">
                                <label id="filterRecordsCount" className='text-center form-label fw-bold' style={{ "color": FilteredRecords.length === 0 ? "darkred" : "darkgreen" }}>{FilteredRecords.length} Records Found From Your Search !</label>
                                <button type='button' className="w-100 text-center btn btn-danger fw-bold border-2 border-black" onClick={clearAllFilters}>Clear Filter</button>
                            </div>
                        </div>
                        {/* <div className="row mt-3">
                            <div className="col"><button className='btn border-2 border-black btn-success w-100 fw-bold text-white' type="button">Apply Filters</button></div>
                            <div className="col"><button className='btn border-2 border-black btn-danger w-100 fw-bold text-white' type="button" onClick={() => { document.getElementById("filterContainer").style.display = "none" }}>Close Filters</button></div>
                        </div> */}
                    </form>
                </div>
            </div>

            {/* All the Cards */}
            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {/* Displaying all the Cards and the Modal Info */}

                        {AllOrdersRecords.length === 0 && <h3>No Orders Available</h3>}

                        {
                            FilteredRecords.length === 0 && AllOrdersRecords.map((order, index) => {

                                const keys = Object.keys(order);
                                console.log(order)

                                return (

                                    <React.Fragment key={order._id}>
                                        {/* AllOrders Card */}
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={order._id}>
                                            <div className="card orderCard">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        <div className="col-2">
                                                            <img src={`/Items/${order.orderImage}`} className={"w-100"} style={{ borderRadius: "5px 5px 5px 5px", border: "2px solid black" }} alt="Materials" />
                                                        </div>
                                                        <div className="col-8">
                                                            <p className='card-text orderItemName'>{order.orderItemName}<br />(#{order.orderID})</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Order From :</strong> {order.orderFrom}</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Order Delivery Address :</strong> {order.orderAddress}</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Total Price :</strong> Rs. {order.orderPrice} <em>(Deducted from your Account Balance)</em></p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Transaction ID :</strong> {order.orderTransactionID}</p>
                                                            {order.orderArrivalTime !== 0 ? <p className="card-text mb-1 text-black align-left"><strong>Order Estimated Arrival Time :</strong> {order.orderArrivalTime} Days</p> : ""}
                                                            {order.orderArrivalTime !== 0 ? <p className="card-text mb-1 text-black align-left"><strong>Order Approved By :</strong> {order.orderApprovedBy}</p> : ""}
                                                            {order.orderArrivalTime !== 0 ? <p className="card-text mb-1 text-black align-left"><strong>Order Approver Name :</strong> {order.orderApproverName}</p> : ""}
                                                            {order.orderArrivalTime !== 0 ? <p className="card-text mb-1 text-black align-left"><strong>Order Approve Date :</strong> {new Date(order.orderApproveDate).toLocaleString()}</p> : ""}

                                                        </div>
                                                        <div className="col-2" style={{ textAlign: "center" }}>
                                                            <p className="card-text mb-1 orderItemName text-black fw-bolder">Order Status : </p>
                                                            {/* <br /> */}
                                                            <img src={order.orderStatus === "Approved" ? approved : order.orderStatus === "Disapproved" ? rejected : orderPending} className={"w-50"} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-footer'>
                                                    <form>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <label htmlFor="arrivalTime" className='text-black fw-medium'>Set the Arrival Time of the Order</label>
                                                                <input type="number" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="arrivalTime" id="arrivalTime" onInput={() => { document.getElementById(`disapproveOrder${index}`).disabled = true }} placeholder="Enter the Arrival Time" required />
                                                            </div>
                                                            <div className="col">
                                                                <label htmlFor="userRole" className='text-black fw-medium'>Your Role</label>
                                                                <input type="text" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="userRole" id="userRole" value={sessionStorage.getItem("role")[0].toUpperCase() + sessionStorage.getItem("role").slice(1).toLowerCase()} readOnly />
                                                            </div>
                                                            <div className="col">
                                                                <label htmlFor="userName" className='text-black fw-medium'>Your Name</label>
                                                                <input type="text" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="userName" id="userName" value={JSON.parse(sessionStorage.getItem("user")).name} readOnly />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col"><button type="submit" className="btn btn-success fw-medium  w-100" disabled={order.orderStatus === "Approved"} id={`approveOrder${index}`} onClick={(e) => { ApproveOrder(e, order._id) }}> <i className="fa-solid fa-circle-check fa-sm" style={{ color: "#FFFFFF" }}></i> Approve Order</button></div>
                                                            <div className="col"><button type="button" className="btn btn-danger fw-medium w-100" id={`disapproveOrder${index}`} onClick={(e) => { DisapproveOrder(e, order._id) }}> <i className="fa-solid fa-circle-xmark fa-sm" style={{ color: "#FFFFFF" }}></i> Disapprove Order</button></div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                    </React.Fragment>
                                )
                            })
                        }

                        {
                            FilteredRecords.length !== 0 && FilteredRecords.map((order, index) => {

                                const keys = Object.keys(order);
                                console.log(order)

                                return (

                                    <React.Fragment key={order._id}>
                                        {/* AllOrders Card */}
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={order._id}>
                                            <div className="card orderCard">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        <div className="col-2">
                                                            <img src={`/Items/${order.orderImage}`} className={"w-100"} style={{ borderRadius: "5px 5px 5px 5px", border: "2px solid black" }} alt="Materials" />
                                                        </div>
                                                        <div className="col-8">
                                                            <p className='card-text orderItemName'>{order.orderItemName}<br />(#{order.orderID})</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Order From :</strong> {order.orderFrom}</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Order Delivery Address :</strong> {order.orderAddress}</p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Total Price :</strong> Rs. {order.orderPrice} <em>(Deducted from your Account Balance)</em></p>
                                                            <p className="card-text mb-1 text-black align-left"><strong>Transaction ID :</strong> {order.orderTransactionID}</p>
                                                        </div>
                                                        <div className="col-2" style={{ textAlign: "center" }}>
                                                            <p className="card-text mb-1 text-black fw-bolder">Order Status : </p>
                                                            {/* <br /> */}
                                                            <img src={order.orderStatus === "Approved" ? approved : order.orderStatus === "Disapproved" ? rejected : orderPending} className={"w-50"} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row my-2">
                                                        <div className="col">
                                                            <label htmlFor="arrivalTime" className='text-black fw-medium'>Set the Arrival Time of the Order</label>
                                                            <input type="number" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="arrivalTime" id="arrivalTime" onInput={() => { document.getElementById(`disapproveOrder${index}`).disabled = true }} placeholder="Enter the Arrival Time" required />
                                                        </div>
                                                        <div className="col">
                                                            <label htmlFor="userRole" className='text-black fw-medium'>Your Role</label>
                                                            <input type="text" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="userRole" id="userRole" value={sessionStorage.getItem("role")[0].toUpperCase() + sessionStorage.getItem("role").slice(1).toLowerCase()} readOnly />
                                                        </div>
                                                        <div className="col">
                                                            <label htmlFor="userName" className='text-black fw-medium'>Your Name</label>
                                                            <input type="text" className="whiteplaceholder placeholder-white form-control bg-dark text-white" name="userName" id="userName" value={JSON.parse(sessionStorage.getItem("user")).name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="row my-2">
                                                        <div className="col"><button className="btn btn-success fw-medium  w-100" disabled={order.orderStatus === "Approved"} id={`approveOrder${index}`}> <i className="fa-solid fa-circle-check fa-sm" style={{ color: "#FFFFFF" }}></i> Approve Order</button></div>
                                                        <div className="col"><button className="btn btn-danger fw-medium w-100" disabled={order.orderStatus === "Approved"} id={`disapproveOrder${index}`}> <i className="fa-solid fa-circle-xmark fa-sm" style={{ color: "#FFFFFF" }}></i> Disapprove Order</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrderToApprove
