import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MyContext from '../Context/MyContext';
import InternalMenuBar from './InternalMenuBar';
import NavBreadcrumb from './NavBreadcrumb';

import orderPending from "../Images/orderPending.png"
import approved from "../Images/approved.png"
import rejected from "../Images/rejected.png"

function OrdersPage() {

    // Access the subjectname from the URL params
    const { categoryname } = useParams();

    let badgeStyle = {
        "position": "absolute",
        "top": "5px",
        "right": "5px",
        "padding": "5px",
        "color": "aliceblue",
        "backgroundColor": "white",
        "borderRadius": "100px"
    }

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [OrderRecords, setOrderRecords] = useState([])
    const [Wishlisted, setWishlisted] = useState(false)
    const [WishlistedID, setWishlistedID] = useState("")
    const [FilteredRecords, setFilteredRecords] = useState([])

    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("token") || !sessionStorage.getItem("role") === "admin") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        // Checking for the session storage orders
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        // Adding this in the recent Accessed
        // contextData.updateRecentlyAccessed('Order Operations', `${location.pathname}`);

        FetchOrderAPI();

    }, [])

    // Function to Fetch the Order Data in the Database
    const FetchOrderAPI = async () => {
        // Calling the Add Order API
        const ordersresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/userorders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            }
        });

        // Variable to handle the API Response
        const fetchOrdersResponse = await ordersresponse.json()
        console.log(fetchOrdersResponse)
        setOrderRecords(fetchOrdersResponse.orders)

    }

    const applyFilter = () => {

        const searchOrderName = document.getElementById("filterOrderName").value;
        const searchOrderType = document.getElementById("filterOrderType").value;
        const searchOrderCategory = document.getElementById("filterOrderCategory").value;
        const searchOrderCode = document.getElementById("filterOrderCode").value;

        let orderNameMatches;
        let orderTypeMatches;
        let orderCategoryMatches;
        let orderCodeMatches;

        const filteredResult = OrderRecords.filter((order) => {

            if (searchOrderName !== "") {
                orderNameMatches = order.orderName.includes(searchOrderName)
            }
            if (searchOrderType !== "") {
                orderTypeMatches = order.orderType.includes(searchOrderType)
            }
            if (searchOrderCategory !== "") {
                orderCategoryMatches = order.orderCategory.includes(searchOrderCategory)
            }
            if (searchOrderCode !== "") {
                orderCodeMatches = order.orderCode.includes(searchOrderCode)
            }

            return (orderNameMatches || searchOrderName === "") && (orderTypeMatches || searchOrderType === "") && (orderCategoryMatches || searchOrderCategory === "") && (orderCodeMatches || searchOrderCode === "")
        });

        setFilteredRecords(filteredResult)
    }

    const clearAllFilters = () => {
        document.getElementById("filterForm").reset()
        setFilteredRecords([])
    }

    // Function to add an order in cart
    const cancelOrder = async (orderID) => {

        console.log("Hello !!")

        const cancelMessage = document.getElementById("orderCancelMsg").value

        // Calling the Add Order API
        const cancelorderresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/cancel/order/${orderID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            },
            body: JSON.stringify({
                cancelMsg: cancelMessage
            })
        });

        // Variable to handle the API Response
        const cancelOrderResponse = await cancelorderresponse.json()

        contextData.showAlert(cancelOrderResponse.status, cancelOrderResponse.msg, cancelOrderResponse.status === "success" ? "alert-success" : "alert-danger")

        FetchOrderAPI()
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
                                <label htmlFor="filterOrderName" className="form-label text-black fw-bold">Order Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterOrderName" name="filterOrderName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterOrderType" className="form-label text-black fw-bold">Order Type</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterOrderType" name="filterOrderType" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterOrderCategory" className="form-label text-black fw-bold">Order Category</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterOrderCategory" name="filterOrderCategory" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterOrderCode" className="form-label text-black fw-bold">Order Code</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterOrderCode" name="filterOrderCode" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3 text-center">
                                <label id="filterRecordsCount" className='text-center form-label fw-bold' style={{ "color": FilteredRecords.length === 0 ? "darkred" : "darkgreen" }}>{FilteredRecords.length} Records Found From Your Search !</label>
                                <button type='button' className="w-100 text-center btn btn-danger fw-bold border-2 border-black" onClick={clearAllFilters}>Clear Filter</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* All the Cards */}
            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {/* Displaying all the Cards and the Modal Info */}
                        {OrderRecords.length === 0 ? <h3>No Orders are Made By You Till Now . . .</h3> : ""}
                        {
                            FilteredRecords.length === 0 && OrderRecords.map((order, index) => {

                                const keys = Object.keys(order);
                                console.log(order)

                                return (

                                    <React.Fragment key={order._id}>
                                        {/* Order Card */}
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={order._id}>
                                            <div className="card orderCard">
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-2">
                                                            <img src={`/Items/${order.orderImage}`} className={"w-100"} style={{ borderRadius: "5px 5px 5px 5px", border: "2px solid black" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`} />
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
                                                            <img src={order.orderStatus === "Approved" ? approved : order.orderStatus === "Disapproved" ? rejected : orderPending} className={"w-50"} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" disabled={order.orderStatus === "Approved"} data-bs-toggle="modal" data-bs-target={`#CancelOrderForm${index}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-trash3-fill" viewBox="0 0 20 20">
                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                        </svg> Cancel Order</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Cancel Message and Submit Form ! */}
                                        <div className="modal fade dark-modal" id={`CancelOrderForm${index}`} tabIndex="-1" aria-labelledby={`CancelOrderForm${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CancelOrderForm${index}Label`}>Cancel Your Order 🤔</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addOrdercloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <label htmlFor="orderCancelMsg" className="col-form-label">Can You Please us why you have cancelled this order ?</label>
                                                        <textarea className="form-control" id="orderCancelMsg"></textarea>
                                                    </div>
                                                    <div className="modal-footer bg-dark">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { cancelOrder(order.orderID) }} >Submit</button>
                                                    </div>
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
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={order._id}>
                                            <div className="card orderCard">
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-2">
                                                            <img src={`/Items/${order.orderImage}`} className={"w-100"} style={{ borderRadius: "5px 5px 5px 5px", border: "2px solid black" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`} />
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
                                                            <img src={order.orderStatus === "Approved" ? approved : order.orderStatus === "Disapproved" ? rejected : orderPending} className={"w-50"} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#OrderInfoModal${index}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" disabled={order.orderStatus === "Approved"} data-bs-toggle="modal" data-bs-target={`#CancelOrderForm${index}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-trash3-fill" viewBox="0 0 20 20">
                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                        </svg> Cancel Order</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Cancel Message and Submit Form ! */}
                                        <div className="modal fade dark-modal" id={`CancelOrderForm${index}`} tabIndex="-1" aria-labelledby={`CancelOrderForm${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CancelOrderForm${index}Label`}>Order Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addOrdercloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <label htmlFor="orderCancelMsg" className="col-form-label">Can You Please us why you have cancelled this order ?</label>
                                                        <textarea className="form-control" id="orderCancelMsg"></textarea>
                                                    </div>
                                                    <div className="modal-footer bg-dark">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { cancelOrder(order.orderID) }} >Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Info Modal */}
                                        <div className="modal fade dark-modal" id={`FilteredOrderInfoModal${index}`} tabIndex="-1" aria-labelledby={`FilteredOrderInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`FilteredOrderInfoModal${index}Label`}>Order Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addOrdercloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <img src={`/Orders/${order.orderImages}`} className="w-100 mb-3" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", order[data]) */ }
                                                                        if (data === "orderAddedBy" || data === "orderLastUpdateBy" || data === "orderViews" || data === "orderCartCount" || data === "orderWishlistCount" || data === "orderOrderedCount" || data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            if (data === "orderName") {
                                                                                field = "Order Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "orderDate") {
                                                                                field = "Order Date"
                                                                                fieldValue = new Date(order[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? order[data] : fieldValue}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                    <div className="modal-footer bg-dark">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
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

export default OrdersPage
