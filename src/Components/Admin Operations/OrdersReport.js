import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import orderPending from "../../Images/orderPending.png"
import approved from "../../Images/approved.png"
import rejected from "../../Images/rejected.png"

function OrdersReport() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [AllOrdersRecords, setAllOrdersRecords] = useState([])
    const [DeletedOrdersRecords, setDeletedOrdersRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [TotalOrdersCount, setTotalOrdersCount] = useState(0)
    const [ApprovedOrdersRecords, setApprovedOrdersRecords] = useState([])
    const [DisapprovedOrdersRecords, setDisapprovedOrdersRecords] = useState([])

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
        TotalOrders();
        TotalDeletedOrders();
        TotalApprovedOrders();
        TotalDisapprovedOrders();

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

    const TotalOrders = async () => {

        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allcustomer`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const allCustomers = await response.json()

        const allTotalOrders = allCustomers.customers.map((customer) => customer.totalOrders)

        let totalSum = 0

        console.log(allTotalOrders)

        allTotalOrders.forEach(customerTotalOrders => {
            totalSum += customerTotalOrders;
        });

        setTotalOrdersCount(totalSum)
    }

    const TotalDeletedOrders = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/alldeletedorders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllDeletedOrders = await response.json()

        console.log(fetchAllDeletedOrders)

        setDeletedOrdersRecords(fetchAllDeletedOrders.deletedOrders)
    }

    const TotalApprovedOrders = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/approvedorders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllApprovedOrders = await response.json()

        console.log(fetchAllApprovedOrders)

        setApprovedOrdersRecords(fetchAllApprovedOrders.orders)
    }

    const TotalDisapprovedOrders = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/unapprovedorders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllDisapprovedOrders = await response.json()

        console.log(fetchAllDisapprovedOrders)

        setDisapprovedOrdersRecords(fetchAllDisapprovedOrders.orders)
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

            {/* All the Cards */}
            <div id="ordersReport">
                <div className="row allOperations mb-5 mt-4 text-white">
                    <div className="container">
                        <div className="row gy-4 px-2">

                            {/* Displaying all the Cards and the Modal Info */}

                            {AllOrdersRecords.length === 0 && <h3 className='mx-2'>No Orders Available</h3>}

                            <hr className="hrSeparator mx-2" />
                            <h3>Total Orders Placed From All Accounts : {TotalOrdersCount} Orders</h3>

                            {
                                AllOrdersRecords.map((order, index) => {

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
                                                </div>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }

                            <hr className="hrSeparator mx-2" />
                            <h3>Total Deleted Orders From Customers : {DeletedOrdersRecords.length} Orders</h3>

                            {
                                DeletedOrdersRecords.length !== 0 && DeletedOrdersRecords.map((order, index) => {

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
                                                </div>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }

                            <hr className="hrSeparator mx-2" />
                            <h3>Total Approved Orders : {ApprovedOrdersRecords.length} Orders</h3>

                            {
                                ApprovedOrdersRecords.length !== 0 && ApprovedOrdersRecords.map((order, index) => {

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
                                                </div>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }

                            <hr className="hrSeparator mx-2" />
                            <h3>Total Disapproved Orders : {DisapprovedOrdersRecords.length} Orders</h3>

                            {
                                DisapprovedOrdersRecords.length !== 0 && DisapprovedOrdersRecords.map((order, index) => {

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
                                                </div>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrdersReport
