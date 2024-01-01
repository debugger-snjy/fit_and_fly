import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../Context/MyContext';
import InternalMenuBar from './InternalMenuBar';
import NavBreadcrumb from './NavBreadcrumb';

function WishlistsPage() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [WishlistRecords, setWishlistRecords] = useState([])
    const [Categorynames, setCategorynames] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditWishlistRecord, setEditWishlistRecord] = useState([])

    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("token") || !sessionStorage.getItem("role") === "admin") {

        sessionStorage.clear()
        navigateTo("/");

        // Showing the Alert Box
        contextData.showAlert("Failed", "Error Fetching the Account Details", "alert-danger")

    }

    // Adding the code that will run when the user will first open the page
    useEffect(() => {

        // Checking for the session storage wishlists
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        // Adding this in the recent Accessed
      // contextData.updateRecentlyAccessed('Wishlist Operations', `${location.pathname}`);

        FetchWishlistAPI();

    }, [])


    // Function to add an item in cart
    const addToCart = async (itemID, wishlistID) => {

        console.log("Hello !!")

        // Calling the Add Item API
        const itemsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/add/itemincart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            },
            body: JSON.stringify({
                itemID
            })
        });

        // Variable to handle the API Response
        const addItemInCartResponse = await itemsresponse.json()

        contextData.showAlert("Success", addItemInCartResponse.msg, "alert-success")
    }

    // Function to Fetch the Wishlist Data in the Database
    const FetchWishlistAPI = async () => {
        // Calling the Add Wishlist API
        const wishlistsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/userwishlists`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token")
            }
        });

        // Variable to handle the API Response
        const fetchWishlistsResponse = await wishlistsresponse.json()
        console.log(fetchWishlistsResponse)
        setWishlistRecords(fetchWishlistsResponse.wishlists)
    }

    // Function to Delete the Wishlist Data : 
    const DeleteWishlistAPI = async (wishlistId) => {
        // Calling the Add Wishlist API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/iteminwishlist/${wishlistId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            }
        });

        // Variable to handle the API Response
        const deleteWishlistResponse = await response.json()

        console.log(deleteWishlistResponse)

        // Showing the Alert Message that Wishlist Deleted
        contextData.showAlert("Success", deleteWishlistResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchWishlistAPI()

    }

    const applyFilter = () => {

        const searchItemName = document.getElementById("filterItemName").value;
        const searchItemType = document.getElementById("filterItemType").value;
        const searchItemCategory = document.getElementById("filterItemCategory").value;
        const searchItemCode = document.getElementById("filterItemCode").value;

        let wishlistNameMatches;
        let wishlistTypeMatches;
        let wishlistCategoryMatches;
        let wishlistCodeMatches;

        const filteredResult = WishlistRecords.filter((wishlist) => {

            if (searchItemName !== "") {
                wishlistNameMatches = wishlist.itemName.includes(searchItemName)
            }
            if (searchItemType !== "") {
                wishlistTypeMatches = wishlist.itemType.includes(searchItemType)
            }
            if (searchItemCategory !== "") {
                wishlistCategoryMatches = wishlist.itemCategory.includes(searchItemCategory)
            }
            if (searchItemCode !== "") {
                wishlistCodeMatches = wishlist.itemCode.includes(searchItemCode)
            }

            return (wishlistNameMatches || searchItemName === "") && (wishlistTypeMatches || searchItemType === "") && (wishlistCategoryMatches || searchItemCategory === "") && (wishlistCodeMatches || searchItemCode === "")
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
                                <label htmlFor="filterItemName" className="form-label text-black fw-bold">Wishlist Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemName" name="filterItemName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemType" className="form-label text-black fw-bold">Wishlist Type</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemType" name="filterItemType" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemCategory" className="form-label text-black fw-bold">Wishlist Category</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemCategory" name="filterItemCategory" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemCode" className="form-label text-black fw-bold">Wishlist Code</label>
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
                        {WishlistRecords.length === 0 ? <h3>No Items are Added in Your Wishlists</h3> : ""}
                        {
                            FilteredRecords.length === 0 && WishlistRecords.map((wishlist, index) => {

                                const keys = Object.keys(wishlist);
                                console.log(wishlist)
                                console.log("Records : ", WishlistRecords)

                                return (

                                    <React.Fragment key={wishlist._id}>

                                        {/* Wishlist Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={wishlist._id}>
                                            <div className="card wishlistCard">
                                                <img src={`/Items/${wishlist.itemImages}`} className="card-img-top wishlistImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#WishlistInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#WishlistInfoModal${index}`}>
                                                    <p className="card-text itemName">{wishlist.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{wishlist.itemCategory} - {wishlist.itemType} [ Rs. {wishlist.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { addToCart(wishlist.wishlistItem, wishlist._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg>Add to Cart</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteWishlistAPI(wishlist._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Wishlist Info Modal */}
                                        <div className="modal fade dark-modal" id={`WishlistInfoModal${index}`} tabIndex="-1" aria-labelledby={`WishlistInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`WishlistInfoModal${index}Label`}>Wishlist Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addWishlistcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <img src={`/Items/${wishlist.itemImages}`} className="w-100 mb-3" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", wishlist[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "user" || data === "wishlistItem") { }
                                                                        else {
                                                                            if (data === "wishlistName") {
                                                                                field = "Wishlist Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "wishlistDate") {
                                                                                field = "Wishlist Date"
                                                                                fieldValue = new Date(wishlist[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? wishlist[data] : fieldValue}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((wishlist, index) => {

                                const keys = Object.keys(wishlist);
                                console.log(wishlist)

                                return (

                                    <React.Fragment key={wishlist._id}>
                                        {/* Wishlist Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={wishlist._id}>
                                            <div className="card wishlistCard">
                                                <img src={`/Items/${wishlist.itemImages}`} className="card-img-top wishlistImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#WishlistInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#WishlistInfoModal${index}`}>
                                                    <p className="card-text itemName">{wishlist.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{wishlist.itemCategory} - {wishlist.itemType} [ Rs. {wishlist.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { addToCart(wishlist.wishlistItem, wishlist._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg> Add to Cart</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteWishlistAPI(wishlist._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Wishlist Info Modal */}
                                        <div className="modal fade dark-modal" id={`WishlistInfoModal${index}`} tabIndex="-1" aria-labelledby={`WishlistInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`WishlistInfoModal${index}Label`}>Wishlist Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addWishlistcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <img src={`/Items/${wishlist.itemImages}`} className="card-img-top wishlistImg" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", wishlist[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "user" || data === "wishlistItem") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{wishlist[data]}</td>
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

export default WishlistsPage
