import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import InternalMenuBar from '../InternalMenuBar';
import NavBreadcrumb from '../NavBreadcrumb';
import employeeMaleImg from "../../Images/male_employee0.png"
import employeeFemaleImg from "../../Images/female_employee0.png"

function EmployeeOperations() {

    // Used to navigate things
    let navigateTo = useNavigate()
    let location = useLocation()

    // Using the Context API
    const contextData = useContext(MyContext);

    const [EmployeeRecords, setEmployeeRecords] = useState([])
    const [FilteredRecords, setFilteredRecords] = useState([])
    const [EditEmployeeRecord, setEditEmployeeRecord] = useState([])

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
        // contextData.updateRecentlyAccessed('Employee Operations', `${location.pathname}`);

        FetchEmployeeAPI();

    }, [])


    // Function to Add the Employee Data in the Database
    const AddEmployeeAPI = async (event) => {

        const addEmployeeForm = document.getElementById("AddEmployeeForm")

        event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const employeeId = document.getElementById("employeeId").value;
        const employeedesignation = document.getElementById("employeedesignation").value;
        const employeeemail = document.getElementById("employeeemail").value;
        const employeepassword = document.getElementById("employeepassword").value;
        const employeename = document.getElementById("employeename").value;
        const employeegender = document.getElementById("genderMale").checked ? "male" : document.getElementById("genderFemale").checked ? "female" : "";
        const employeephone = document.getElementById("employeephone").value;
        const employeeaddress = document.getElementById("employeeaddress").value;
        const role = sessionStorage.getItem("role")


        if (employeeId === "" || employeedesignation === "" || employeeaddress === "" || employeeemail === "" || employeepassword === "" || employeename === "" || employeephone === "" || employeegender === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Add Employee API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/add/employee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    employeeId: employeeId,
                    phone: employeephone,
                    name: employeename,
                    password: employeepassword,
                    email: employeeemail,
                    gender: employeegender,
                    designation: employeedesignation,
                    role: role,
                    address: employeeaddress,
                })
            });

            // Variable to handle the API Response
            const addEmployeeResponse = await response.json()

            console.log(addEmployeeResponse)

            if (addEmployeeResponse.status === "success") {
                // After a successful submission, hide the modal
                document.getElementById("addEmployeeCloseBtn").click()
                document.getElementById("addEmployeeModel").style.display = "none"
                contextData.showAlert("Success", addEmployeeResponse.msg, "alert-success")
                addEmployeeForm.reset();

                // Fetching the Records Again for the Updated Records
                FetchEmployeeAPI()
            }
            else {
                contextData.showAlert("Failed", addEmployeeResponse.msg, "alert-danger")
            }
        }
    }

    // Function to Fetch the Employee Data in the Database
    const FetchEmployeeAPI = async () => {
        // Calling the Add Employee API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/fetch/allemployee`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const fetchEmployeesResponse = await response.json()

        console.log(fetchEmployeesResponse)

        setEmployeeRecords(fetchEmployeesResponse.employees)
    }

    // Function to Delete the Employee Data : 
    const DeleteEmployeeAPI = async (employeeId) => {
        // Calling the Add Employee API
        const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/delete/employee/${employeeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Variable to handle the API Response
        const deleteEmployeeResponse = await response.json()

        console.log(deleteEmployeeResponse)

        // Showing the Alert Message that Employee Deleted
        contextData.showAlert("Success", deleteEmployeeResponse.msg, "alert-success")

        // Again Fetching the Records to refresh the records
        FetchEmployeeAPI()

    }

    // Function to Edit the Employee Data : 
    const EditEmployeeAPI = async (employeeId) => {

        const editEmployeeForm = document.getElementById("EditEmployeeForm")

        console.log(EditEmployeeRecord)

        // event.preventDefault(); // Prevent the form from submitting

        // Access form fields by their Ids

        const updatedemployeedesignation = document.getElementById("updatedemployeedesignation").value;
        const updatedemployeeemail = document.getElementById("updatedemployeeemail").value;
        const updatedemployeepassword = document.getElementById("updatedemployeepassword").value;
        const updatedemployeename = document.getElementById("updatedemployeename").value;
        const updatedemployeephone = document.getElementById("updatedemployeephone").value;
        const updatedemployeeaddress = document.getElementById("updatedemployeeaddress").value;
        const updatedemployeegender = document.getElementById("updatedgenderMale").checked ? "male" : document.getElementById("updatedgenderFemale").checked ? "female" : "";
        const userrole = sessionStorage.getItem("role")

        if (updatedemployeedesignation === "" || updatedemployeeemail === "" || updatedemployeepassword === "" || updatedemployeename === "" || updatedemployeephone === "" || updatedemployeeaddress === "" || updatedemployeegender === "") {
            contextData.showAlert("Failed", "Some Fields are Empty !", "alert-danger")
        }
        else {
            // Calling the Edit Employee API
            const response = await fetch(`http://localhost:5000/api/${sessionStorage.getItem("role")}/update/employee/${employeeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    designation: updatedemployeedesignation,
                    email: updatedemployeeemail,
                    password: updatedemployeepassword,
                    name: updatedemployeename,
                    phone: updatedemployeephone,
                    gender: updatedemployeegender,
                    address: updatedemployeeaddress,
                    role: userrole,
                })
            });

            // Variable to handle the API Response
            const editEmployeeResponse = await response.json()

            if (editEmployeeResponse.status === "success") {
                // After a successful submission, hide the modal
                contextData.showAlert("Success", editEmployeeResponse.msg, "alert-success")
                editEmployeeForm.reset();
                document.getElementById("editEmployeecloseBtn").click()

                // Fetching the Records Again for the Updated Records
                FetchEmployeeAPI()
            }
            else {
                contextData.showAlert("Failed", editEmployeeResponse.msg, "alert-danger")
            }
        }
    }

    const onChange = (event) => {

        // Now, Getting the data that user will be adding and that will be saved on that spot when user add the data
        setEditEmployeeRecord({
            ...EditEmployeeRecord, // This will be the data that is already present
            [event.target.name]: event.target.value
            // Using the above line, it will ADD the data and OVERWRITE if already present
            // Thus, when we write the title, then value of title will be the text that user will write
        })

        console.log("EditAdmin : ", EditEmployeeRecord)

    }

    const applyFilter = () => {

        const searchEmployeeID = document.getElementById("filterEmployeeID").value;
        const searchName = document.getElementById("filterName").value;
        const searchDesignation = document.getElementById("filterDesignation").value;

        let employeeIdMatches;
        let nameMatches;
        let designationMatches;

        const filteredResult = EmployeeRecords.filter((emp) => {
            if (searchEmployeeID !== "") {
                employeeIdMatches = emp.employeeId.toString() === searchEmployeeID || searchEmployeeID === '';
            }
            if (searchName !== "") {
                nameMatches = emp.name.toLowerCase().includes(searchName.toLowerCase())
            }
            if (searchDesignation !== "") {
                designationMatches = emp.designation.toLowerCase().includes(searchDesignation.toLowerCase());
            }

            return (employeeIdMatches || searchEmployeeID === "") && (nameMatches || searchName === "") && (designationMatches || searchDesignation === "");
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
                                <label htmlFor="filterEmployeeID" className="form-label text-black fw-bold">Employee ID</label>
                                <input type="number" className="form-control text-white fw-bold" id="filterEmployeeID" name="filterEmployeeID" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterName" className="form-label text-black fw-bold">Name</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterName" name="filterName" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg">
                                <label htmlFor="filterDesignation" className="form-label text-black fw-bold">Designation</label>
                                <input type="text" className="form-control text-white fw-bold" id="filterDesignation" name="filterDesignation" style={{ backgroundColor: "#1e1e1e" }} onChange={() => { applyFilter() }} required />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3 text-center">
                                <label id="filterRecordsCount" className='text-center form-label fw-bold' style={{ "color": FilteredRecords.length === 0 ? "darkred" : "darkgreen" }}>{FilteredRecords.length} Records Found From Your Search !</label>
                                <button type='button' className="w-100 text-center btn btn-danger fw-bold border-2 border-black" onClick={clearAllFilters}>Clear Filter</button>
                            </div>
                        </div>
                        {/* <div className="row mt-3">
                            <div className="col"><button className='btn border-2 border-black btn-success w-100 fw-bold text-white' type="button">Apply Filters</button></div>
                            <div className="col"><button className='btn border-2 border-black btn-danger w-100 fw-bold text-white' type="button" onClick={() => { document.getElementById("filterContainer").style.display = "none" }}>Close Filters</button></div>
                        </div> */}
                    </form>
                </div>
            </div>

            {/* All the Cards */}
            <div className="row allOperations mb-5 mt-4 text-white">
                <div className="container">
                    <div className="row gy-4 px-2">

                        {/* Displaying all the Cards and the Modal Info */}
                        {EmployeeRecords.length === 0 ? <h3>No Employess Are Added till now</h3> : ""}
                        
                        {
                            FilteredRecords.length === 0 && EmployeeRecords.map((employee, index) => {

                                const keys = Object.keys(employee);
                                console.log(employee)

                                return (

                                    <React.Fragment key={employee._id}>
                                        {/* Employee Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={employee._id}>
                                            <div className="card itemCard">
                                                <img src={employee.gender === "male" ? employeeMaleImg : employeeFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#EmployeeInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#EmployeeInfoModal${index}`}>
                                                    <p className="card-text itemName">{employee.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">Employee ID : {employee.employeeId} [ {employee.designation} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editEmployeeModel" onClick={() => { setEditEmployeeRecord(employee) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Employee</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteEmployeeAPI(employee._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Employee</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Employee Info Modal */}
                                        <div className="modal fade dark-modal" id={`EmployeeInfoModal${index}`} tabIndex="-1" aria-labelledby={`EmployeeInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`EmployeeInfoModal${index}Label`}>Employee Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addEmployeecloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", employee[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{employee[data]}</td>
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
                            FilteredRecords.length !== 0 && FilteredRecords.map((employee, index) => {

                                const keys = Object.keys(employee);
                                console.log(employee)

                                return (

                                    <React.Fragment key={employee._id}>
                                        {/* Employee Card */}
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={employee._id}>
                                            <div className="card itemCard">
                                                <img src={employee.gender === "male" ? employeeMaleImg : employeeFemaleImg} className="card-img-top itemImg" alt="Materials" data-bs-toggle="modal" data-bs-target={`#EmployeeInfoModal${index}`} />
                                                <div className="card-body" data-bs-toggle="modal" data-bs-target={`#EmployeeInfoModal${index}`}>
                                                    <p className="card-text itemName">{employee.name}</p>
                                                    <p className="card-text small itemName fs-5 fw-normal">Employee ID : {employee.employeeId} [ {employee.designation} ]</p>
                                                </div>
                                                <div className='card-footer'>
                                                    <div className="row">
                                                        <div className="col"><button className="btn btn-dark w-100" data-bs-toggle="modal" data-bs-target="#editEmployeeModel" onClick={() => { setEditEmployeeRecord(employee) }}><i className="fa-solid fa-pen" style={{ "color": "#ffffff" }}></i> Edit Employee</button></div>
                                                        <div className="col"><button className="btn btn-dark w-100" onClick={() => { DeleteEmployeeAPI(employee._id) }}><i className="fa-solid fa-trash" style={{ "color": "#ffffff" }}></i> Delete Employee</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Employee Info Modal */}
                                        <div className="modal fade dark-modal" id={`EmployeeInfoModal${index}`} tabIndex="-1" aria-labelledby={`EmployeeInfoModal${index}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content bg-dark text-light">
                                                    <div className="modal-header bg-dark text-light">
                                                        <h1 className="modal-title fs-5" id={`EmployeeInfoModal${index}Label`}>Employee Info</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="addEmployeecloseBtn" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className='table table-dark'>
                                                            <tbody>
                                                                {
                                                                    keys.map((data, index) => {
                                                                        {/* console.log(data, " --> ", employee[data]) */ }
                                                                        if (data === "_id" || data === "__v" || data === "attendanceData") { }
                                                                        else {
                                                                            return (
                                                                                <tr key={"ModalInfoTable" + index}>
                                                                                    <td>{data[0].toUpperCase() + data.slice(1).toLowerCase()}</td>
                                                                                    <td>{employee[data]}</td>
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

                        <button className='btn btn-light w-50 text-black fw-bold' data-bs-toggle="modal" data-bs-target="#addEmployeeModel" style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", height: "50px", boxShadow: "0px 0px 25px 10px black" }}>Add New Employee</button>

                        {/* Add Employee Model */}
                        <div className="modal fade dark-modal" id="addEmployeeModel" aria-labelledby="addEmployeeModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="addEmployeeModelLabel">Add Employee Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.getElementById("AddEmployeeForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Employee Data */}
                                    <form id='AddEmployeeForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="employeeId" className="form-label">Employee Id</label>
                                                <input type="number" className="form-control text-black fw-bold" id="employeeId" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeedesignation" className="form-label">Designation</label>
                                                <input type="text" className="form-control text-black fw-bold" id="employeedesignation" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeeemail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="employeeemail" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeepassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="employeepassword" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeename" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="employeename" required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeegender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="employeegender" id="genderMale" />
                                                    <label className="form-check-label" htmlFor="genderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="employeegender" id="genderFemale" />
                                                    <label className="form-check-label" htmlFor="genderFemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeephone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="employeephone" maxLength={10} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="employeeaddress" className="form-label">Address</label>
                                                <input type="text" className="form-control text-black fw-bold" id="employeeaddress" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-danger" id="addEmployeeCloseBtn" data-bs-dismiss="modal" onClick={() => { document.getElementById("AddEmployeeForm").reset(); }}>Close</button>
                                            <button type="submit" className="btn btn-success" onClick={AddEmployeeAPI}>Submit Form</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Edit Employee Model */}
                        <div className="modal fade dark-modal" id="editEmployeeModel" tabIndex="-1" aria-labelledby="editEmployeeModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content bg-dark text-light">
                                    <div className="modal-header bg-dark text-light">
                                        <h1 className="modal-title fs-5" id="editEmployeeModelLabel">Edit Employee Form</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" id="editEmployeecloseBtn" aria-label="Close" onClick={() => { document.getElementById("EditEmployeeForm").reset(); }}></button>
                                    </div>

                                    {/* Form For Adding the Employee Data */}
                                    <form id='EditEmployeeForm'>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeeId" className="form-label">Employee Id</label>
                                                <input type="number" className="form-control text-black fw-bold" id="updatedemployeeId" name="employeeId" readOnly value={EditEmployeeRecord.employeeId} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeedesignation" className="form-label">Designation</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedemployeedesignation" name="designation" onChange={onChange} value={EditEmployeeRecord.designation} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeeemail" className="form-label">Email address</label>
                                                <input type="email" className="form-control text-black fw-bold" id="updatedemployeeemail" name="email" onChange={onChange} value={EditEmployeeRecord.email} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeepassword" className="form-label">Password</label>
                                                <input type="password" className="form-control text-black fw-bold" id="updatedemployeepassword" name="password" onChange={onChange} value={EditEmployeeRecord.password} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeename" className="form-label">Name</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedemployeename" name="name" onChange={onChange} value={EditEmployeeRecord.name} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeegender" className="form-label">Gender</label>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderMale" value="male" onChange={onChange} checked={EditEmployeeRecord.gender == "male" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="gender" id="updatedgenderFemale" value="female" onChange={onChange} checked={EditEmployeeRecord.gender == "female" ? true : false} required />
                                                    <label className="form-check-label" htmlFor="updatedgenderfemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeephone" className="form-label">Phone Number</label>
                                                <input type="tel" className="form-control text-black fw-bold" id="updatedemployeephone" maxLength={10} name="phone" onChange={onChange} value={EditEmployeeRecord.phone} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="updatedemployeeaddress" className="form-label">Address</label>
                                                <input type="text" className="form-control text-black fw-bold" id="updatedemployeeaddress" maxLength={10} name="phone" onChange={onChange} value={EditEmployeeRecord.address} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer bg-dark">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { document.getElementById("EditEmployeeForm").reset(); }}>Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => { EditEmployeeAPI(EditEmployeeRecord._id) }}>Submit Form</button>
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

export default EmployeeOperations
