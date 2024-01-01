import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';

function ItemsOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [ItemRecords, setItemRecords] = useState([])
    const [Categorynames, setCategorynames] = useState([])
    const [CategoryAvailable, setCategoryAvailable] = useState(false)
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditItemRecord, setEditItemRecord] = useState([])

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


    // Function to Add the Item Data in the Database
    const AddItemAPI = async (event) => {


        const addItemForm = document.getElementById("AddItemForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const itemName = document.getElementById("itemName").value;
        const itemPrice = document.getElementById("itemPrice").value;
        const itemType = document.getElementById("itemType").value;
        const itemCode = document.getElementById("itemCode").value;
        const itemCategory = document.getElementById("itemCategory").value;
        const itemAdderName = document.getElementById("itemAdderName").value;
        const itemImage = document.getElementById("itemImage").files[0];


        if (itemName == "" || itemPrice == "" || itemType == "" || itemCode == "" || itemCategory == "" || itemAdderName == "" || itemImage == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {

            var data = new FormData()
            data.append("itemName", itemName,)
            data.append("itemPrice", itemPrice,)
            data.append("itemType", itemType,)
            data.append("itemCode", itemCode,)
            data.append("itemCategory", itemCategory,)
            data.append("itemAdderName", itemAdderName,)
            data.append("file", itemImage)

            // Calling the Add Item API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/add/item`, {
                method: "POST",
                body: data,
            });


            // Variable to handle the API Response
            const addItemResponse = await response.json()

            console.log(addItemResponse)

            if (addItemResponse.status === "success") {
                // After a successful submission, hide the modal
                document.getElementById("addItemCloseBtn").click()
                document.getElementById("addItemModel").style.display = "none"
                contextData.showAlert("Success", addItemResponse.msg, "alert-success")
                addItemForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchItemAPI()
            }
            else {
                contextData.showAlert("Failed", addItemResponse.msg, "alert-danger")
            }
        }
    }

    // Function to Fetch the Item Data in the Database
    const FetchItemAPI = async () => {
        // Calling the Add Item API
        const itemsresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allitems`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchItemsResponse = await itemsresponse.json()
        console.log(fetchItemsResponse)
        setItemRecords(fetchItemsResponse.items)

        const categoryresponse = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allcategoriesnames`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const fetchCategoryResponse = await categoryresponse.json()
        if (fetchCategoryResponse.status === "success") {
            setCategoryAvailable(true)
        }
        const categoryNamesOnly = fetchCategoryResponse.categories;
        setCategorynames(categoryNamesOnly)
    }

    // Function to Delete the Item Data : 
    const DeleteItemAPI = async (itemId) => {
        // Calling the Add Item API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/item/${itemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteItemResponse = await response.json()

        console.log(deleteItemResponse)

        // Showing the Alert Message that Item Deleted
        contextData.showAlert("Success", deleteItemResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchItemAPI()

    }

    // Function to Edit the Item Data : 
    const EditItemAPI = async (itemId) => {

        const editItemForm = document.getElementById("EditItemForm")

        console.log(EditItemRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const updateditemname = document.getElementById("updateditemname").value;
        const updateditemprice = document.getElementById("updateditemprice").value;
        const updateditemtype = document.getElementById("updateditemtype").value;
        const updateditemcode = document.getElementById("updateditemcode").value;
        const updateditemcategory = document.getElementById("updateditemcategory").value;
        const updateditemaddedby = document.getElementById("updateditemaddedby").value;

        // let updateditemimage;
        // if (document.getElementById("updateditemimage").file) {
        //     updateditemimage = document.getElementById("updateditemimage").file[0]
        // }

        if (updateditemname == "" || updateditemprice == "" || updateditemtype == "" || updateditemcode == "" || updateditemcategory == "" || updateditemaddedby == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {

            var data = new FormData()
            data.append("itemName", updateditemname,)
            data.append("itemPrice", updateditemprice,)
            data.append("itemType", updateditemtype,)
            data.append("itemCode", updateditemcode,)
            data.append("itemCategory", updateditemcategory,)
            data.append("itemAddedby", updateditemaddedby,)

            // if (updateditemimage) {
            //     data.append("file", updateditemimage)
            // }

            // Calling the Edit Item API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/update/item/${itemId}`, {
                method: "PUT",
                body: data
            });

            // Variable to handle the API Response
            const editItemResponse = await response.json()

            if (editItemResponse.status === "success") {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editItemResponse.msg, "alert-success")
                editItemForm.reset();
                document.getElementById("editItemcloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchItemAPI()
            }
            else {
                contextData.showAlert("Failed", editItemResponse.msg, "alert-danger")
            }
        }
    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditItemRecord({
            ...EditItemRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        console.log("EditAdmin : ", EditItemRecord)

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
                            CategoryAvailable && FilteredRecords.length === 0 && ItemRecords.map((item, index) => {

                                const keys = Object.keys(item);
                                console.log(item)

                                return (

                                    <React.Fragment key={item._id}>
                                        {/* Item Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={item._id}>
                                            <div className="card itemCard">
                                                <img src={`/Items/${item.itemImages}`} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`}>
                                                    <p className="card-text itemName">{item.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{item.itemCategory} - {item.itemType} [ Rs. {item.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editItemModel" onClick={() => { setEditItemRecord(item) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Item</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteItemAPI(item._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Item</button></div>
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
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
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
                            CategoryAvailable && FilteredRecords.length !== 0 && FilteredRecords.map((item, index) => {

                                const keys = Object.keys(item);
                                console.log(item)

                                return (

                                    <React.Fragment key={item._id}>
                                        {/* Item Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={item._id}>
                                            <div className="card itemCard">
                                                <img src={`/Items/${item.itemImages}`} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#ItemInfoModal${index}`}>
                                                    <p className="card-text itemName">{item.itemCode} - {item.itemName}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">{item.itemCategory} - {item.itemType} [ Rs. {item.itemPrice} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editItemModel" onClick={() => { setEditItemRecord(item) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Item</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteItemAPI(item._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Item</button></div>
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

                                                        <img src={`/Items/${item.itemImages}`} className="card-img-top itemImg" alt="Materials" />

                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", item[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{item[data]}</td>
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
                            !CategoryAvailable && <h3>No Categories Available, Kindly add Category First and then add Items</h3>
                        }

                        {CategoryAvailable && ItemRecords.length === 0 ? <h3>No Items Are Added till now</h3> : ""}


                        {/* ItemRecords ? */}
                        {/* {EmployeeRecords ? <h3>No Employess Are Added till now</h3> : ""} */}

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addItemModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Item</button>

                        {/* Add Item Model */}
                        <div className="modal fade dark-modal" id="addItemModel" aria-labelledby="addItemModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addItemModelLabel">Add Item Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddItemForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Item Data */}
                                    <form id='AddItemForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="itemName" className="form-label">Item Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="itemName" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="itemPrice" className="form-label">Item Price</label>
                                                <input type="number" className="form-control text-black fw-bold" id="itemPrice" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="itemType" className="form-label">Item Type</label>
                                                <input type="text" className="form-control text-black fw-bold" id="itemType" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="itemCode" className="form-label">Item Code</label>
                                                <input type="text" className="form-control text-black fw-bold" id="itemCode" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="itemCategory" className="form-label">Item Category</label>

                                                {CategoryAvailable ? (
                                                    <select className="form-select form-control text-black fw-bold" id="itemCategory">
                                                        {Categorynames.map((category, index) => (
                                                            <option key={index} value={category}>{category}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p>No Categories Available . . .</p>)}

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="itemAdderName" className="form-label">Item Added By</label>
                                                <input type="text" className="form-control text-black fw-bold" id="itemAdderName" defaultValue={sessionStorage.getItem("role").toString()[0].toUpperCase() + sessionStorage.getItem("role").toString().slice(1) + " - " + JSON.parse(sessionStorage.getItem("user")).name} readOnly required />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="itemImage" className="form-label">Item Image</label>
                                                <input type="file" className="form-control text-black fw-bold" id="itemImage" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addItemCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddItemForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddItemAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Item Model */}
                        <div className="modal fade dark-modal" id="editItemModel" tabIndex="-1" aria-labelledby="editItemModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editItemModelLabel">Edit Item Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editItemcloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditItemForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Item Data */}
                                    <form id='EditItemForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updateditemname" className="form-label">Item Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateditemname" name="itemName" onChange={onChange} value={EditItemRecord.itemName} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateditemprice" className="form-label">Item Price</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateditemprice" name="itemPrice" onChange={onChange} value={EditItemRecord.itemPrice} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateditemtype" className="form-label">Item Type</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateditemtype" name="itemType" onChange={onChange} value={EditItemRecord.itemType} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateditemcode" className="form-label">Item Code</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateditemcode" name="itemCode" onChange={onChange} value={EditItemRecord.itemCode} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateditemcategory" className="form-label">Item Category</label>
                                                {/* <input type="text" className="form-control text-black fw-bold" id="updateditemcategory" name="itemCategory" onChange={onChange} value={EditItemRecord.itemCategory} required /> */}
                                                {
                                                    CategoryAvailable ? (<select className="form-select form-control text-black fw-bold" id='updateditemcategory' name="itemCategory" onChange={onChange} defaultValue={EditItemRecord.itemCategory} required>
                                                        {
                                                            Categorynames.map((category, index) => {
                                                                return (
                                                                    <option key={index} value={category}>{category}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>) : (
                                                        <p>No Categories Available . . .</p>)
                                                }
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updateditemaddedby" className="form-label">Item Added By</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updateditemaddedby" name="itemAddedBy" onChange={onChange} value={EditItemRecord.itemAddedBy} required />
                                            </div>
                                            {/* <div className="mb-3">
                                                <label htmlFor="updateditemimage" className="form-label">Item Image</label>
                                                <input type="file" className="form-control text-black fw-bold" id="updateditemimage" name="itemImageLocation" onChange={onChange} required />
                                            </div> */}
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditItemForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditItemAPI(EditItemRecord._id) }}>Submit Form</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default ItemsOperations
