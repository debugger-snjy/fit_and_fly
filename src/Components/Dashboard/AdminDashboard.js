import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext'
import NavBreadcrumb from '../NavBreadcrumb';
import InternalMenuBar from '../InternalMenuBar';

// Images
import adminOperations from "../../Images/admin.png"
import employeeOperations from "../../Images/employees.png"
import customerOperations from "../../Images/customers.png"
import itemOperations from "../../Images/items.png"
import categoryOperations from "../../Images/category01.png"
import orderToApprove from "../../Images/OrderToApprove02.png"
import ordersReports from "../../Images/ordersReport.png"
import itemReports from "../../Images/itemReports.png"
import transactionReports from "../../Images/transactionReports.png"

function AdminDashboard() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    const customStyle = {
        "padding": "4px 20px",
        "backgroundColor": "white",
        "margin": "2px",
        "borderRadius": "20px",
    };

    // Using the Context API
    const contextData = useContext(MyContext);

    useEffect(() => {
        if (sessionStorage.getItem("role").toString() !== "admin") {
            navigateTo("/error_page")
        }
    }, [])

    if (sessionStorage.getItem("user") == "" || sessionStorage.getItem("token") == "") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Functions to open different Pages : 
    const openAdminOperations = () => {
        navigateTo(`${location.pathname}/admin_operations`)
    }
    const openEmployeeOperations = () => {
        navigateTo(`${location.pathname}/employee_operations`)
    }
    const openCustomerOperations = () => {
        navigateTo(`${location.pathname}/customer_operations`)
    }
    const openItemOperations = () => {
        navigateTo(`${location.pathname}/item_operations`)
    }
    const openCategoryOperations = () => {
        navigateTo(`${location.pathname}/category_operations`)
    }
    const openApproveOrder = () => {
        navigateTo(`${location.pathname}/order_to_approve`)
    }
    const openOrdersReport = () => {
        navigateTo(`${location.pathname}/order_reports`)
    }
    const openItemsReport = () => {
        navigateTo(`${location.pathname}/item_reports`)
    }
    const openTransactionsReport = () => {
        navigateTo(`${location.pathname}/transaction_reports`)
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
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openAdminOperations}>
                                <img src={adminOperations} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Admin Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openEmployeeOperations}>
                                <img src={employeeOperations} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Employee Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openCustomerOperations}>
                                <img src={customerOperations} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Customer Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openItemOperations}>
                                <img src={itemOperations} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Item Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openCategoryOperations}>
                                <img src={categoryOperations} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Category Operations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                            <div className="card itemCard" onClick={openApproveOrder}>
                                <img src={orderToApprove} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName" >Approve Order</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-4">
                <hr className='hrSeparator' style={{ "height": "2px" }} />
            </div>

            <span className="my-3 menutextStyle text-black" style={customStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" className="bi bi-caret-right-fill" viewBox="0 0 20 20">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
                Analysis & Reports
            </span>

            <div className="row my-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openOrdersReport}>
                                <img src={ordersReports} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openItemsReport}>
                                <img src={itemReports} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Items</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 col-xxl-2">
                            <div className="card itemCard" onClick={openTransactionsReport}>
                                <img src={transactionReports} className="card-img-top itemImg" alt="Materials" />
                                <div className="card-body">
                                    <p className="card-text itemName">Transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AdminDashboard
