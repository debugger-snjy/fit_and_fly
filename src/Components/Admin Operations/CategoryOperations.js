import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';

function CategoryOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [CategoryRecords, setCategoryRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditCategoryRecord, setEditCategoryRecord] = useState([])

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
      // contextData.updateRecentlyAccessed('Category Operations', `${location.pathname}`);

        FetchCategoryAPI();

    }, [])


    // Function to Add the Category Data in the Database
    const AddCategoryAPI = async (event) => {


        const addCategoryForm = document.getElementById("AddCategoryForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const categoryName = document.getElementById("categoryName").value;
        const categoryAddedBy = document.getElementById("categoryAddedBy").value;
        const categoryAdderName = document.getElementById("categoryAdderName").value;
        const categoryFile = document.getElementById("categoryImage").files[0];


        if (categoryName === "" || categoryAddedBy === "" || categoryAdderName === "" || categoryFile == "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")

        }
        else {

            var data = new FormData()
            data.append("categoryName", categoryName,)
            data.append("categoryAddedBy", categoryAddedBy,)
            data.append("categoryAdderName", categoryAdderName,)
            data.append("file", categoryFile)

            // Calling the Add Category API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/add/category`, {
                method: "POST",
                body: data,
            });


            // Variable to handle the API Response
            const addCategoryResponse = await response.json()

            console.log(addCategoryResponse)

            if (addCategoryResponse.status === "success") {
                // After a successful submission, hide the modal
                document.getElementById("addCategoryCloseBtn").click()
                document.getElementById("addCategoryModel").style.display = "none"
                contextData.showAlert("Success", addCategoryResponse.msg, "alert-success")
                addCategoryForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchCategoryAPI()
            }
            else {
                contextData.showAlert("Failed", addCategoryResponse.msg, "alert-danger")
            }
        }
    }

    // Function to Fetch the Category Data in the Database
    const FetchCategoryAPI = async () => {
        // Calling the Add Category API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allcategories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchCategoriesResponse = await response.json()

        console.log(fetchCategoriesResponse)

        setCategoryRecords(fetchCategoriesResponse.categories)
    }

    // Function to Delete the Category Data : 
    const DeleteCategoryAPI = async (categoryId) => {
        // Calling the Add Category API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/category/${categoryId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteCategoryResponse = await response.json()

        console.log(deleteCategoryResponse)

        // Showing the Alert Message that Category Deleted
        contextData.showAlert("Success", deleteCategoryResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchCategoryAPI()

    }

    // Function to Edit the Category Data : 
    const EditCategoryAPI = async (categoryId) => {

        const editCategoryForm = document.getElementById("EditCategoryForm")

        console.log(EditCategoryRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const updatedcategoryname = document.getElementById("updatedcategoryname").value;
        const updatedcategoryaddedby = document.getElementById("updatedcategoryaddedby").value;
        const updatedcategoryaddername = document.getElementById("updatedcategoryaddername").value;
        // let updatedcategoryimage;
        // if (document.getElementById("updatedcategoryimage").file) {
        //     updatedcategoryimage = document.getElementById("updatedcategoryimage").file[0]
        // }

        if (updatedcategoryname === "" || updatedcategoryaddedby === "" || updatedcategoryaddername === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {

            var data = new FormData()
            data.append("categoryName", updatedcategoryname,)
            data.append("categoryAddedBy", updatedcategoryaddedby,)
            data.append("categoryAdderName", updatedcategoryaddername,)

            // if (updatedcategoryimage) {
            //     data.append("file", updatedcategoryimage)
            // }


            // Calling the Edit Category API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/update/category/${categoryId}`, {
                method: "PUT",
                body: data
            });

            // Variable to handle the API Response
            const editCategoryResponse = await response.json()

            if (editCategoryResponse.status === "success") {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editCategoryResponse.msg, "alert-success")
                editCategoryForm.reset();
                document.getElementById("editCategorycloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchCategoryAPI()
            }
            else {
                contextData.showAlert("Failed", editCategoryResponse.msg, "alert-danger")
            }
        }
    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditCategoryRecord({
            ...EditCategoryRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        console.log("EditAdmin : ", EditCategoryRecord)

    }

    const applyFilter = () => {

        const searchCategoryName = document.getElementById("filterCategoryName").value;
        const searchCategoryBy = document.getElementById("filterCategoryBy").value;

        let categoryNameMatches;
        let categoryByMatches;

        const filteredResult = CategoryRecords.filter((item) => {

            if (searchCategoryName !== "") {
                categoryNameMatches = item.categoryName.includes(searchCategoryName)
            }
            if (searchCategoryBy !== "") {
                categoryByMatches = item.addedBy.includes(searchCategoryBy);
            }

            return (categoryNameMatches || searchCategoryName === "") && (categoryByMatches || searchCategoryBy === "");
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
                                <label htmlFor="filterCategoryName" className="form-label text-black fw-bold">Category Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterCategoryName" name="filterCategoryName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterCategoryBy" className="form-label text-black fw-bold">Category By</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterCategoryBy" name="filterCategoryBy" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                        {CategoryRecords.length === 0 ? <h3>No Category Are Added till now</h3> : ""}

                        {
                            FilteredRecords.length === 0 && CategoryRecords.map((category, index) => {

                                const keys = Object.keys(category);
                                console.log(category)

                                return (

                                    <React.Fragment key={category._id}>
                                        {/* Category Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={category._id}>
                                            <div className="card itemCard">
                                                <img src={`/Categories/${category.categoryImageLocation}`} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CategoryInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CategoryInfoModal${index}`}>
                                                    <p className="card-text itemName">{category.categoryName}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editCategoryModel" onClick={() => { setEditCategoryRecord(category) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Category</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCategoryAPI(category._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Category</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Info Modal */}
                                        <div className="modal fade dark-modal" id={`CategoryInfoModal${index}`} tabIndex="-1" aria-labelledby={`CategoryInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CategoryInfoModal${index}Label`}>Category Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCategorycloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        let field, fieldValue = "";

                                                                        {/* console.log(data, " --> ", category[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            if (data === "categoryName") {
                                                                                field = "Category Name"
                                                                            }
                                                                            else if (data === "addedBy") {
                                                                                field = "Added By"
                                                                            }
                                                                            else if (data === "categoryDate") {
                                                                                field = "Category Date"
                                                                                fieldValue = new Date(category[data].toString()).toLocaleString()
                                                                            }
                                                                            else {
                                                                                field = data;
                                                                            }
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{field === data ? data[0].toUpperCase() + data.slice(1).toLowerCase() : field}</td>
                                                                                    <td>{fieldValue === "" ? category[data] : fieldValue}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((category, index) => {

                                const keys = Object.keys(category);
                                console.log(category)

                                return (

                                    <React.Fragment key={category._id}>
                                        {/* Category Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={category._id}>
                                            <div className="card itemCard">
                                                <img src={`/Categories/${category.categoryImageLocation}`} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CategoryInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CategoryInfoModal${index}`}>
                                                    <p className="card-text itemName">{category.categoryName}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editCategoryModel" onClick={() => { setEditCategoryRecord(category) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Category</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCategoryAPI(category._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Category</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Info Modal */}
                                        <div className="modal fade dark-modal" id={`CategoryInfoModal${index}`} tabIndex="-1" aria-labelledby={`CategoryInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CategoryInfoModal${index}Label`}>Category Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCategorycloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", category[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{category[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addCategoryModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Category</button>

                        {/* Add Category Model */}
                        <div className="modal fade dark-modal" id="addCategoryModel" aria-labelledby="addCategoryModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addCategoryModelLabel">Add Category Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddCategoryForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Category Data */}
                                    <form id='AddCategoryForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="categoryName" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="categoryAddedBy" className="form-label">Added By</label>
                                                <input type="text" className="form-control text-black fw-bold" id="categoryAddedBy" defaultValue={sessionStorage.getItem("role").toString()[0].toUpperCase() + sessionStorage.getItem("role").toString().slice(1)} readOnly required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="categoryAdderName" className="form-label">Adder Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="categoryAdderName" defaultValue={JSON.parse(sessionStorage.getItem("user")).name} readOnly required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="categoryImage" className="form-label">Category Image</label>
                                                <input type="file" className="form-control text-black fw-bold" id="categoryImage" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addCategoryCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddCategoryForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddCategoryAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Category Model */}
                        <div className="modal fade dark-modal" id="editCategoryModel" tabIndex="-1" aria-labelledby="editCategoryModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editCategoryModelLabel">Edit Category Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editCategorycloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditCategoryForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Category Data */}
                                    <form id='EditCategoryForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updatedcategoryname" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcategoryname" name="categoryName" onChange={onChange} value={EditCategoryRecord.categoryName} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcategoryaddedby" className="form-label">Added By</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcategoryaddedby" name="addedBy" onChange={onChange} value={EditCategoryRecord.addedBy} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcategoryaddername" className="form-label">Adder Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcategoryaddername" name="categoryAdderName" onChange={onChange} value={EditCategoryRecord.categoryAdderName} required />
                                            </div>
                                            {/* <div className="mb-3">
                                                <label htmlFor="updatedcategoryimage" className="form-label">Category Image</label>
                                                <input type="file" className="form-control text-black fw-bold" id="updatedcategoryimage" name="categoryImageLocation" onChange={onChange} required />
                                            </div> */}
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditCategoryForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditCategoryAPI(EditCategoryRecord._id) }}>Submit Form</button>
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

export default CategoryOperations
