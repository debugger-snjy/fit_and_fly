import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MyContext from '../Context/MyContext';
import InternalMenuBar from './InternalMenuBar';
import NavBreadcrumb from './NavBreadcrumb';

function ItemsPage() {

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

    const [ItemRecords, setItemRecords] = useState([])
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

        // Checking for the session storage items
        if (!sessionStorage.getItem("token") && !sessionStorage.getItem("role") === "admin") {

            // If not present then clear the session storage and move to the home page
            sessionStorage.clear()
            navigateTo("/")
        }

        // Adding this in the recent Accessed
        // contextData.updateRecentlyAccessed('Item Operations', `${location.pathname}`);

        FetchItemAPI();

    }, [])

    // Function to Fetch the Item Data in the Database
    const FetchItemAPI = async () => {
        // Calling the Add Item API
        const itemsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/items/category/${categoryname[0].toUpperCase() + categoryname.slice(1).toLowerCase()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchItemsResponse = await itemsresponse.json()
        console.log(fetchItemsResponse)
        setItemRecords(fetchItemsResponse.items)

    }

    const applyFilter = () => {

        const searchItemName = document.getElementById("filterItemName").value;
        const searchItemType = document.getElementById("filterItemType").value;
        const searchItemCategory = document.getElementById("filterItemCategory").value;
        const searchItemCode = document.getElementById("filterItemCode").value;
        const searchItemAddedBy = document.getElementById("filterItemAddedBy").value;
        const searchItemUpdatedBy = document.getElementById("filterItemUpdatedBy").value;

        let itemNameMatches;
        let itemTypeMatches;
        let itemCategoryMatches;
        let itemCodeMatches;
        let itemAddedByMatches;
        let itemUpdatedByMatches;

        const filteredResult = ItemRecords.filter((item) => {

            if (searchItemName !== "") {
                itemNameMatches = item.itemName.includes(searchItemName)
            }
            if (searchItemType !== "") {
                itemTypeMatches = item.itemType.includes(searchItemType)
            }
            if (searchItemCategory !== "") {
                itemCategoryMatches = item.itemCategory.includes(searchItemCategory)
            }
            if (searchItemCode !== "") {
                itemCodeMatches = item.itemCode.includes(searchItemCode)
            }
            if (searchItemAddedBy !== "") {
                itemAddedByMatches = item.itemAddedBy.includes(searchItemAddedBy)
            }
            if (searchItemUpdatedBy !== "") {
                itemUpdatedByMatches = item.itemUpdatedBy.includes(searchItemUpdatedBy)
            }

            return (itemNameMatches || searchItemName === "") && (itemTypeMatches || searchItemType === "") && (itemCategoryMatches || searchItemCategory === "") && (itemCodeMatches || searchItemCode === "") && (itemAddedByMatches || searchItemAddedBy === "") && (itemUpdatedByMatches || searchItemUpdatedBy === "")
        });

        setFilteredRecords(filteredResult)
    }

    const clearAllFilters = () => {
        document.getElementById("filterForm").reset()
        setFilteredRecords([])
    }

    // Function to fetch all the wishlisted Item by the User : 
    

    // Function to add an item in cart
    const addToCart = async (itemCode, itemID) => {

        console.log("Hello !!")

        // Calling the Add Item API
        const itemsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/add/itemincart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": sessionStorage.getItem("token").toString()
            },
            body: JSON.stringify({
                itemCode,
                itemID
            })
        });

        // Variable to handle the API Response
        const addItemInCartResponse = await itemsresponse.json()

        contextData.showAlert("Success", addItemInCartResponse.msg, "alert-success")
    }

    // Function to add an item in wishlist
    const addToWishlist = async (itemCode, itemID) => {

        console.log("Hello !!")

        if (Wishlisted) {

            // Calling the Add Item API
            const wishlistItemsResponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/delete/iteminwishlist/${WishlistedID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": sessionStorage.getItem("token").toString()
                }
            });

            setWishlisted(!Wishlisted)

            // Variable to handle the API Response
            const addItemInWishlistResponse = await wishlistItemsResponse.json()

            contextData.showAlert(addItemInWishlistResponse.status, addItemInWishlistResponse.msg, "alert-success")
        }
        else {
            // Calling the Add Item API
            const wishlistItemsResponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/add/iteminwishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": sessionStorage.getItem("token").toString()
                },
                body: JSON.stringify({
                    itemCode,
                    itemID
                })
            });

            setWishlisted(!Wishlisted)

            // Variable to handle the API Response
            const addItemInWishlistResponse = await wishlistItemsResponse.json()

            setWishlistedID(addItemInWishlistResponse.wishlist._id)

            contextData.showAlert(addItemInWishlistResponse.status, addItemInWishlistResponse.msg, addItemInWishlistResponse.status.toLowerCase() === "success" ? "alert-success" : "alert-danger")
        }
    }

    // Function to add an item in wishlist
    const buyNow = async (itemCode, itemID) => {

        console.log("Hello !!")

        // // Calling the Add Item API
        // const itemsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role").toString()}/add/iteminwishlist`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "auth-token": sessionStorage.getItem("token").toString()
        //     },
        //     body: JSON.stringify({
        //         itemCode,
        //         itemID
        //     })
        // });

        // setWishlisted(!Wishlisted)

        // // Variable to handle the API Response
        // const addItemInCartResponse = await itemsresponse.json()

        // contextData.showAlert("Success", addItemInCartResponse.msg, "alert-success")
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
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemAddedBy" className="form-label text-black fw-bold">Item Added By</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemAddedBy" name="filterItemAddedBy" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterItemUpdatedBy" className="form-label text-black fw-bold">Item Updated By</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterItemUpdatedBy" name="filterItemUpdatedBy" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                        {
                            FilteredRecords.length === 0 && ItemRecords.map((item, index) => {

                                const keys = Object.keys(item);
                                console.log(item)

                                return (

                                    <React.Fragment key={item._id}>
                                        {/* Item Card */}
                                        <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={item._id}>
                                            <div className="card itemCard">
                                                {/* Wishlist Icons */}
                                                <button className="button border-0 wishlistBadge" style={badgeStyle} onClick={() => { addToWishlist(item.itemCode, item._id) }} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={Wishlisted ? `red` : `grey`} className="bi bi-heart-fill" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                                </svg></button>
                                                <img src={`/Items/${item.itemImages}`} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`}>
                                                    <p className="card-text itemName align-left">{item.itemName} ({item.itemCode})</p>
                                                    <p className="card-text itemName fs-6 fw-normal">{item.itemCategory} - {item.itemType} [ Rs. {item.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { addToCart(item.itemCode, item._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg> Add to Cart</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { buyNow(item.itemCode, item._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 20 20">
                                                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
                                                        </svg> Buy Now</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Info Modal */}
                                        <div className="modal fade dark-modal" id={`ItemInfoModal${index}`} tabIndex="-1" aria-labelledby={`ItemInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`ItemInfoModal${index}Label`}>Item Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addItemcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <img src={`/Items/${item.itemImages}`} className="w-100 mb-3" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", item[data]) */ }
                                                                        if (data === "itemAddedBy" || data === "itemLastUpdateBy" || data === "itemViews" || data === "itemCartCount" || data === "itemWishlistCount" || data === "itemOrderedCount" || data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            if (data === "itemName") {
                                                                                field = "Item Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "itemDate") {
                                                                                field = "Item Date"
                                                                                fieldValue = new Date(item[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? item[data] : fieldValue}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((item, index) => {

                                const keys = Object.keys(item);
                                console.log(item)

                                return (

                                    <React.Fragment key={item._id}>
                                        {/* Item Card */}
                                        <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={item._id}>
                                            <div className="card itemCard">
                                                <button className="button border-0 wishlistBadge" style={badgeStyle}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                                </svg></button>
                                                <img src={`/Items/${item.itemImages}`} style={{ borderRadius: "5px 5px 0px 0px" }} alt="Materials" data-bs-toggle="modal" data-bs-target={`#FilteredItemInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#FilteredItemInfoModal${index}`}>
                                                    <p className="card-text itemName align-left">{item.itemName} ({item.itemCode})</p>
                                                    <p className="card-text itemName fs-6 fw-normal">{item.itemCategory} - {item.itemType} [ Rs. {item.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { addToCart(item.itemCode, item._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-plus-fill" viewBox="0 0 20 20">
                                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                                                        </svg> Add to Cart</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 20 20">
                                                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
                                                        </svg> Buy Now</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Info Modal */}
                                        <div className="modal fade dark-modal" id={`FilteredItemInfoModal${index}`} tabIndex="-1" aria-labelledby={`FilteredItemInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`FilteredItemInfoModal${index}Label`}>Item Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addItemcloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <img src={`/Items/${item.itemImages}`} className="w-100 mb-3" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", item[data]) */ }
                                                                        if (data === "itemAddedBy" || data === "itemLastUpdateBy" || data === "itemViews" || data === "itemCartCount" || data === "itemWishlistCount" || data === "itemOrderedCount" || data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            if (data === "itemName") {
                                                                                field = "Item Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "itemDate") {
                                                                                field = "Item Date"
                                                                                fieldValue = new Date(item[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? item[data] : fieldValue}</td>
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

export default ItemsPage
