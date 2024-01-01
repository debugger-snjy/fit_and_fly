import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../Context/MyContext';
import InternalMenuBar from './InternalMenuBar';
import NavBreadcrumb from './NavBreadcrumb';

function CartsPage() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [CartRecords, setCartRecords] = useState([])
    const [Categorynames, setCategorynames] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditCartRecord, setEditCartRecord] = useState([])

    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("token") || !sessionStorage.getItem("role") === "admin") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        contextData.showAlert("Info", "Kindly Update Your Address if Your Address is Changed","alert-info")

        // Checking for the session storage carts
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        // Adding this in the recent Accessed
        // contextData.updateRecentlyAccessed('Cart Operations', `${location.pathname}`);

        FetchCartAPI();

    }, [])


    // Function to add an item in cart
    const orderItem = async (cartID) => {

        console.log("Hello !!")

        // Calling the Add Item API
        const orderitemresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/order/item/${cartID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            }
        });

        // Variable to handle the API Response
        const itemOrderedResponse = await orderitemresponse.json()

        contextData.showAlert(itemOrderedResponse.status, itemOrderedResponse.msg, itemOrderedResponse.status === "success" ? "alert-success" : "alert-danger")
    }

    // Function to Fetch the Cart Data in the Database
    const FetchCartAPI = async () => {
        // Calling the Add Cart API
        const cartsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/usercartitems`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            }
        });

        // Variable to handle the API Response
        const fetchCartsResponse = await cartsresponse.json()
        console.log(fetchCartsResponse)
        setCartRecords(fetchCartsResponse.cartItems)
    }

    // Function to Delete the Cart Data : 
    const DeleteCartAPI = async (cartId) => {
        // Calling the Add Cart API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/itemincart/${cartId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            }
        });

        // Variable to handle the API Response
        const deleteCartResponse = await response.json()

        console.log(deleteCartResponse)

        // Showing the Alert Message that Cart Deleted
        contextData.showAlert("Success", deleteCartResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchCartAPI()

    }

    const applyFilter = () => {

        const searchItemName = document.getElementById("filterItemName").value;
        const searchItemType = document.getElementById("filterItemType").value;
        const searchItemCategory = document.getElementById("filterItemCategory").value;
        const searchItemCode = document.getElementById("filterItemCode").value;

        let cartNameMatches;
        let cartTypeMatches;
        let cartCategoryMatches;
        let cartCodeMatches;

        const filteredResult = CartRecords.filter((cart) => {

            if (searchItemName !== "") {
                cartNameMatches = cart.itemName.includes(searchItemName)
            }
            if (searchItemType !== "") {
                cartTypeMatches = cart.itemType.includes(searchItemType)
            }
            if (searchItemCategory !== "") {
                cartCategoryMatches = cart.itemCategory.includes(searchItemCategory)
            }
            if (searchItemCode !== "") {
                cartCodeMatches = cart.itemCode.includes(searchItemCode)
            }

            return (cartNameMatches || searchItemName === "") && (cartTypeMatches || searchItemType === "") && (cartCategoryMatches || searchItemCategory === "") && (cartCodeMatches || searchItemCode === "")
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
                                <label htmlFor="filterItemName" className="form-label text-black fw-bold">Item Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemName" name="filterItemName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemType" className="form-label text-black fw-bold">Item Type</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemType" name="filterItemType" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemCategory" className="form-label text-black fw-bold">Item Category</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemCategory" name="filterItemCategory" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemCode" className="form-label text-black fw-bold">Item Code</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemCode" name="filterItemCode" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                        {CartRecords.length === 0 ? <h3>No Items are Added in Cart</h3> : ""}
                        {
                            FilteredRecords.length === 0 && CartRecords.map((cart, index) => {

                                const keys = Object.keys(cart);
                                console.log(cart)
                                console.log("Records : ", CartRecords)

                                return (

                                    <React.Fragment key={cart._id}>

                                        {/* Cart Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={cart._id}>
                                            <div className="card cartCard">
                                                <img src={`/Items/${cart.itemImages}`} className="card-img-top cartImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CartInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CartInfoModal${index}`}>
                                                    <p className="card-text itemName">{cart.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{cart.itemCategory} - {cart.itemType} [ Rs. {cart.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { orderItem(cart._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg>Order Item</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCartAPI(cart._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cart Info Modal */}
                                        <div className="modal fade dark-modal" id={`CartInfoModal${index}`} tabIndex="-1" aria-labelledby={`CartInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CartInfoModal${index}Label`}>Cart Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCartcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <img src={`/Items/${cart.itemImages}`} className="w-100 mb-3" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", cart[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "user" || data === "cartItem" || data === "itemOrdered") { }
                                                                        else {
                                                                            if (data === "cartName") {
                                                                                field = "Cart Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "cartDate") {
                                                                                field = "Cart Date"
                                                                                fieldValue = new Date(cart[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? cart[data] : fieldValue}</td>
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

                        {
                            FilteredRecords.length !== 0 && FilteredRecords.map((cart, index) => {

                                const keys = Object.keys(cart);
                                console.log(cart)

                                return (

                                    <React.Fragment key={cart._id}>
                                        {/* Cart Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={cart._id}>
                                            <div className="card cartCard">
                                                <img src={`/Items/${cart.itemImages}`} className="card-img-top cartImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CartInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CartInfoModal${index}`}>
                                                    <p className="card-text itemName">{cart.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{cart.itemCategory} - {cart.itemType} [ Rs. {cart.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { orderItem(cart.cartItem, cart._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg> Add to Cart</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCartAPI(cart._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cart Info Modal */}
                                        <div className="modal fade dark-modal" id={`CartInfoModal${index}`} tabIndex="-1" aria-labelledby={`CartInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CartInfoModal${index}Label`}>Cart Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCartcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <img src={`/Items/${cart.itemImages}`} className="card-img-top cartImg" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", cart[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "user" || data === "cartItem" || data === "itemOrdered") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{cart[data]}</td>
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

export default CartsPage
