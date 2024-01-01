import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import customerMaleImg from "../../Images/male_customer.png"
import customerFemaleImg from "../../Images/female_customer.png"

function CustomerOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [CustomerRecords, setCustomerRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditCustomerRecord, setEditCustomerRecord] = useState([])

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
        // contextData.updateRecentlyAccessed('Customer Operations', `${location.pathname}`);

        FetchCustomerAPI();

    }, [])


    // Function to Add the Customer Data in the Database
    const AddCustomerAPI = async (event) => {

        const addCustomerForm = document.getElementById("AddCustomerForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids
        const customeremail = document.getElementById("customeremail").value;
        const customerpassword = document.getElementById("customerpassword").value;
        const customername = document.getElementById("customername").value;
        const customergender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderFemale").checked ? "female" : "";
        const customerphone = document.getElementById("customerphone").value;
        const customeraddress = document.getElementById("customeraddress").value;
        const customeraccountbalance = document.getElementById("customeraccountBalance").value;
        const role = sessionStorage.getItem("role")


        if (customeraddress === "" || customeremail === "" || customerpassword === "" || customername === "" || customerphone === "" || customergender === "" || customeraccountbalance === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Customer API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/add/customer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: customerphone,
                    name: customername,
                    password: customerpassword,
                    email: customeremail,
                    gender: customergender,
                    role: role,
                    address: customeraddress,
                    account_balance: customeraccountbalance
                })
            });

            // Variable to handle the API Response
            const addCustomerResponse = await response.json()

            console.log(addCustomerResponse)

            if (addCustomerResponse.status === "success") {
                // After a successful submission, hide the modal
                document.getElementById("addCustomerCloseBtn").click()
                document.getElementById("addCustomerModel").style.display = "none"
                contextData.showAlert("Success", addCustomerResponse.msg, "alert-success")
                addCustomerForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchCustomerAPI()
            }
            else {
                contextData.showAlert("Failed", addCustomerResponse.msg, "alert-danger")
            }
        }
    }

    // Function to Fetch the Customer Data in the Database
    const FetchCustomerAPI = async () => {
        // Calling the Add Customer API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allcustomer`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchCustomersResponse = await response.json()

        console.log(fetchCustomersResponse)

        setCustomerRecords(fetchCustomersResponse.customers)
    }

    // Function to Delete the Customer Data : 
    const DeleteCustomerAPI = async (customerId) => {
        // Calling the Add Customer API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/customer/${customerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteCustomerResponse = await response.json()

        console.log(deleteCustomerResponse)

        // Showing the Alert Message that Customer Deleted
        contextData.showAlert("Success", deleteCustomerResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchCustomerAPI()

    }

    // Function to Edit the Customer Data : 
    const EditCustomerAPI = async (customerId) => {

        const editCustomerForm = document.getElementById("EditCustomerForm")

        console.log(EditCustomerRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const updatedcustomeremail = document.getElementById("updatedcustomeremail").value;
        const updatedcustomerpassword = document.getElementById("updatedcustomerpassword").value;
        const updatedcustomername = document.getElementById("updatedcustomername").value;
        const updatedcustomerphone = document.getElementById("updatedcustomerphone").value;
        const updatedcustomeraddress = document.getElementById("updatedcustomeraddress").value;
        const updatedcustomeraccountBalance = document.getElementById("updatedcustomeraccountBalance").value;
        const updatedcustomertotalOrder = document.getElementById("updatedcustomertotalOrder").value;
        const updatedcustomergender = document.getElementById("updatedgenderMale").checked ? "male" : document.getElementById("updatedgenderFemale").checked ? "female" : "";
        const userrole = sessionStorage.getItem("role")

        if (updatedcustomeraccountBalance === "" || updatedcustomeremail === "" || updatedcustomerpassword === "" || updatedcustomername === "" || updatedcustomerphone === "" || updatedcustomeraddress === "" || updatedcustomergender === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Edit Customer API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/update/customer/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: updatedcustomeremail,
                    password: updatedcustomerpassword,
                    name: updatedcustomername,
                    phone: updatedcustomerphone,
                    gender: updatedcustomergender,
                    address: updatedcustomeraddress,
                    account_balance : updatedcustomeraccountBalance,
                    totalOrders : updatedcustomertotalOrder,
                    role: userrole,
                })
            });

            // Variable to handle the API Response
            const editCustomerResponse = await response.json()

            if (editCustomerResponse.status === "success") {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editCustomerResponse.msg, "alert-success")
                editCustomerForm.reset();
                document.getElementById("editCustomercloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchCustomerAPI()
            }
            else {
                contextData.showAlert("Failed", editCustomerResponse.msg, "alert-danger")
            }
        }
    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditCustomerRecord({
            ...EditCustomerRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        console.log("EditAdmin : ", EditCustomerRecord)

    }

    const applyFilter = () => {

        const searchCustomerEmail = document.getElementById("filterCustomerEmail").value;
        const searchName = document.getElementById("filterName").value;

        let customerEmailMatches;
        let nameMatches;

        const filteredResult = CustomerRecords.filter((emp) => {
            if (searchCustomerEmail !== "") {
                customerEmailMatches = emp.email.toLowerCase().includes(searchCustomerEmail.toLowerCase());
            }
            if (searchName !== "") {
                nameMatches = emp.name.toLowerCase().includes(searchName.toLowerCase())
            }

            return (customerEmailMatches || searchCustomerEmail === "") && (nameMatches || searchName === "");
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
                                <label htmlFor="filterCustomerEmail" className="form-label text-black fw-bold">Customer Email</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterCustomerEmail" name="filterCustomerEmail" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
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
                        {CustomerRecords ? <h3>No Customers Available Till Now !</h3> : ""}

                        {
                            FilteredRecords.length === 0 && CustomerRecords.map((customer, index) => {

                                const keys = Object.keys(customer);
                                console.log(customer)

                                return (

                                    <React.Fragment key={customer._id}>
                                        {/* Customer Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={customer._id}>
                                            <div className="card itemCard">
                                                <img src={customer.gender === "male" ? customerMaleImg : customerFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CustomerInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CustomerInfoModal${index}`}>
                                                    <p className="card-text itemName">{customer.name}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">Email : {customer.email}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editCustomerModel" onClick={() => { setEditCustomerRecord(customer) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Customer</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCustomerAPI(customer._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Customer</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Info Modal */}
                                        <div className="modal fade dark-modal" id={`CustomerInfoModal${index}`} tabIndex="-1" aria-labelledby={`CustomerInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CustomerInfoModal${index}Label`}>Customer Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCustomercloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", customer[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{customer[data]}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((customer, index) => {

                                const keys = Object.keys(customer);
                                console.log(customer)

                                return (

                                    <React.Fragment key={customer._id}>
                                        {/* Customer Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={customer._id}>
                                            <div className="card itemCard">
                                                <img src={customer.gender === "male" ? customerMaleImg : customerFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#CustomerInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#CustomerInfoModal${index}`}>
                                                    <p className="card-text itemName">{customer.name}</p>
                                                    <p className="card-text small itemName fs-6 fw-normal">Email : {customer.email}</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editCustomerModel" onClick={() => { setEditCustomerRecord(customer) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Customer</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteCustomerAPI(customer._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Customer</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Info Modal */}
                                        <div className="modal fade dark-modal" id={`CustomerInfoModal${index}`} tabIndex="-1" aria-labelledby={`CustomerInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`CustomerInfoModal${index}Label`}>Customer Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addCustomercloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", customer[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{customer[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addCustomerModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Customer</button>

                        {/* Add Customer Model */}
                        <div className="modal fade dark-modal" id="addCustomerModel" aria-labelledby="addCustomerModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addCustomerModelLabel">Add Customer Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddCustomerForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Customer Data */}
                                    <form id='AddCustomerForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="customeremail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="customeremail" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customerpassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="customerpassword" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customername" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="customername" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customergender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="customergender" id="genderMale" />
                                                    <label className="form-check-label" htmlFor="genderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="customergender" id="genderFemale" />
                                                    <label className="form-check-label" htmlFor="genderFemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customerphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="customerphone" maxLength={10} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customeraddress" className="form-label">Address</label>
                                                <input type="text" className="form-control text-black fw-bold" id="customeraddress" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customeraccountBalance" className="form-label">Account Balance</label>
                                                <input type="text" className="form-control text-black fw-bold" id="customeraccountBalance" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addCustomerCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddCustomerForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddCustomerAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Customer Model */}
                        <div className="modal fade dark-modal" id="editCustomerModel" tabIndex="-1" aria-labelledby="editCustomerModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editCustomerModelLabel">Edit Customer Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editCustomercloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditCustomerForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Customer Data */}
                                    <form id='EditCustomerForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomeremail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="updatedcustomeremail" name="email" onChange={onChange} value={EditCustomerRecord.email} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomerpassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="updatedcustomerpassword" name="password" onChange={onChange} value={EditCustomerRecord.password} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomername" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcustomername" name="name" onChange={onChange} value={EditCustomerRecord.name} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomergender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderMale" value="male" onChange={onChange} checked={EditCustomerRecord.gender == "male" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderFemale" value="female" onChange={onChange} checked={EditCustomerRecord.gender == "female" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomerphone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="updatedcustomerphone" maxLength={10} name="phone" onChange={onChange} value={EditCustomerRecord.phone} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomeraddress" className="form-label">Address</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcustomeraddress" name="address" onChange={onChange} value={EditCustomerRecord.address} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomeraccountBalance" className="form-label">Account Balance</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcustomeraccountBalance" name="account_balance" onChange={onChange} value={EditCustomerRecord.account_balance} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedcustomertotalOrder" className="form-label">Total Orders</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedcustomertotalOrder" name="totalOrders" onChange={onChange} value={EditCustomerRecord.totalOrders} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditCustomerForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditCustomerAPI(EditCustomerRecord._id) }}>Submit Form</button>
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

export default CustomerOperations
