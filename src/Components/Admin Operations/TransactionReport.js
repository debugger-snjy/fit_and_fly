import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';

function TransactionReport() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [AllTransactionRecords, setAllTransactionRecords] = useState([])
    const [AllSuccessfullTransactionRecords, setAllSuccessfullTransactionRecords] = useState([])
    const [AllFailedTransactionRecords, setAllFailedTransactionRecords] = useState([])

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

        FetchAllSuccessfullTransactionAPI();
        FetchAllFailedTransactionAPI();

    }, [])

    // Function to Fetch the All Successful Transactions Data in the Database
    const FetchAllSuccessfullTransactionAPI = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/transactions/noncancelled`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllTransactions = await response.json()

        console.log(fetchAllTransactions)

        setAllSuccessfullTransactionRecords(fetchAllTransactions.transactions)
    }

    // Function to Fetch the All Failed Transactions Data in the Database
    const FetchAllFailedTransactionAPI = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/transactions/cancelled`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllTransactions = await response.json()

        console.log(fetchAllTransactions)

        setAllFailedTransactionRecords(fetchAllTransactions.transactions)
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

                            <h4>Total Successfull Transactions : {AllSuccessfullTransactionRecords.length} Items</h4>
                            <h4>Total Cancelled Transactions : {AllFailedTransactionRecords.length} Items</h4>

                            <hr className="hrSeparator mx-2" />

                            <h3 className='mx-2'>Successfull Transactions</h3>

                            {AllSuccessfullTransactionRecords.length === 0 && <h4 className='mx-2'>No Successfull Transactions Available</h4>}
                            {
                                AllSuccessfullTransactionRecords.map((transaction, index) => {

                                    return (

                                        <React.Fragment key={transaction._id}>
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={transaction._id}>
                                                <div className="card orderCard">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col">
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction ID :</strong> {transaction.transactionId}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Order ID :</strong> {transaction.transactionorderID}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction From :</strong> {transaction.transactionFrom}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Amount :</strong> {transaction.transactionPrice}</p>
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

                            <h3 className='mx-2'>Cancelled Transactions</h3>

                            {AllFailedTransactionRecords.length === 0 && <h4 className='mx-2'>No Successfull Transactions Available</h4>}
                            {
                                AllFailedTransactionRecords.map((transaction, index) => {

                                    return (

                                        <React.Fragment key={transaction._id}>
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={transaction._id}>
                                                <div className="card orderCard">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col">
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction ID :</strong> {transaction.transactionId}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Order ID :</strong> {transaction.transactionorderID}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction From :</strong> {transaction.transactionFrom}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Amount :</strong> {transaction.transactionPrice}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Cancelled :</strong> {transaction.transactionCancelled.toString()}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Transaction Cancellation Reason :</strong> {transaction.transactionCancelMsg}</p>
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

export default TransactionReport
