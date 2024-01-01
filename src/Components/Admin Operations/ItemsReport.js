import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import orderPending from "../../Images/orderPending.png"
import approved from "../../Images/approved.png"
import rejected from "../../Images/rejected.png"

function ItemsReport() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [AllItemsRecords, setAllItemsRecords] = useState([])
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

        FetchAllItemsAPI()

    }, [])

    // Function to Fetch the AllOrders Data in the Database
    const FetchAllItemsAPI = async () => {
        // Calling the Add AllOrders API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allitems`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchAllItems = await response.json()

        console.log(fetchAllItems)

        setAllItemsRecords(fetchAllItems.items)
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
            <div id="itemReports">
                <div className="row allOperations mb-5 mt-4 text-white">
                    <div className="container">
                        <div className="row gy-4 px-2">

                            {/* Displaying all the Cards and the Modal Info */}

                            {AllItemsRecords.length === 0 && <h3 className='mx-2'>No Orders Available</h3>}

                            <hr className="hrSeparator mx-2" />
                            <h3>Total Items : {AllItemsRecords.length} Items</h3>

                            {
                                AllItemsRecords.map((item, index) => {

                                    const keys = Object.keys(item);
                                    console.log(item)

                                    return (

                                        <React.Fragment key={item._id}>
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" key={item._id}>
                                                <div className="card orderCard">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-2">
                                                                <img src={`/Items/${item.itemImages}`} className={"w-100"} style={{ borderRadius: "5px 5px 5px 5px", border: "2px solid black" }} alt="Materials" />
                                                            </div>
                                                            <div className="col-10">

                                                                <p className="card-text orderItemName">{item.itemName} ({item.itemCode})</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Item Price :</strong> {item.itemPrice}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Item Category :</strong> {item.itemCategory} - {item.itemType}</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Views on this Item :</strong> {item.itemViews} times</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Item Added in Cart :</strong> {item.itemCartCount} times</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Item Added in Wishlist :</strong> {item.itemWishlistCount} times</p>
                                                                <p className="card-text mb-1 text-black align-left"><strong>Item Ordered :</strong> {item.itemOrderedCount} times</p>
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

export default ItemsReport
