import './App.css';

// Importing Route and Routes for the Routing
// import { Route, Routes, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Navbar from './Components/Navbar';

// Importing MyState 
import Login from './Components/Login';
import MyState from "./Context/MyState"
import Alert from './Components/Alert';
import CustomerDashboard from './Components/Dashboard/CustomerDashboard';
import EmployeeDashboard from './Components/Dashboard/EmployeeDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import ErrorPage from './Components/ErrorPage';
import ViewProfile from "./Components/ViewProfile"
import AdminOperations from './Components/Admin Operations/AdminOperations';
import EmployeeOperations from "./Components/Admin Operations/EmployeeOperations"
import CustomerOperations from "./Components/Admin Operations/CustomerOperations"
import ItemOperations from "./Components/Admin Operations/ItemsOperations"
import CategoryOperations from "./Components/Admin Operations/CategoryOperations"
import OrderToApprove from "./Components/Admin Operations/OrderToApprove"
import ItemsPage from './Components/ItemsPage';
import WishlistsPage from './Components/WishlistsPage';
import CartsPage from './Components/CartsPage';
import OrdersPage from './Components/OrdersPage';
import Signup from './Components/Signup';
import OrdersReport from './Components/Admin Operations/OrdersReport'
import ItemsReport from './Components/Admin Operations/ItemsReport';
import TransactionReport from './Components/Admin Operations/TransactionReport';

function App() {

	return (
		<>
			{/* Adding all other inside it means that we want to use it all them */}
			{/* Allow to access state variables inside all the components */}
			<MyState>

				{/* Adding Navigation Bar */}
				<Navbar />

				{/* Adding the Alert Component which will be modified later */}
				<div className="alertspace">
					<Alert title="SAMPLE" message="Your Message will be displayed Here" effect="alert-success" />
				</div>

				<div className="container-fluid px-3" id='websiteContent'>

					{/* Adding and Setting the Routers */}
					<Routes>

						{/* Login Route */}
						<Route exact path='/' element={<Login />} />
						<Route exact path='/signup' element={<Signup />} />

						{/* Customer Routes */}
						<Route exact path={`/dashboard/customer`} element={<CustomerDashboard />} />
						<Route exact path={`/dashboard/customer/profile`} element={<ViewProfile />} />
						<Route path={`/dashboard/customer/category/:categoryname`} element={<ItemsPage />} />
						<Route path={`/dashboard/customer/wishlists`} element={<WishlistsPage />} />
						<Route path={`/dashboard/customer/carts`} element={<CartsPage />} />
						<Route path={`/dashboard/customer/orders`} element={<OrdersPage />} />


						{/* Employee Routes */}
						<Route exact path={`/dashboard/employee`} element={<EmployeeDashboard />} />
						<Route exact path={`/dashboard/employee/profile`} element={<ViewProfile />} />
						<Route exact path={'/dashboard/employee/item_operations'} element={<ItemOperations />} />
						<Route exact path={'/dashboard/employee/category_operations'} element={<CategoryOperations />} />
						<Route exact path={'/dashboard/employee/order_to_approve'} element={<OrderToApprove />} />
						<Route exact path={'/dashboard/employee/order_reports'} element={<OrdersReport />} />
						<Route exact path={'/dashboard/employee/item_reports'} element={<ItemsReport />} />
						<Route exact path={'/dashboard/employee/transaction_reports'} element={<TransactionReport />} />


						{/* Admin Routes */}
						<Route exact path={`/dashboard/admin`} element={<AdminDashboard />} />
						<Route exact path={`/dashboard/admin/profile`} element={<ViewProfile />} />
						<Route exact path={'/dashboard/admin/admin_operations'} element={<AdminOperations />} />
						<Route exact path={'/dashboard/admin/employee_operations'} element={<EmployeeOperations />} />
						<Route exact path={'/dashboard/admin/customer_operations'} element={<CustomerOperations />} />
						<Route exact path={'/dashboard/admin/item_operations'} element={<ItemOperations />} />
						<Route exact path={'/dashboard/admin/category_operations'} element={<CategoryOperations />} />
						<Route exact path={'/dashboard/admin/order_to_approve'} element={<OrderToApprove />} />
						<Route exact path={'/dashboard/admin/order_reports'} element={<OrdersReport />} />
						<Route exact path={'/dashboard/admin/item_reports'} element={<ItemsReport />} />
						<Route exact path={'/dashboard/admin/transaction_reports'} element={<TransactionReport />} />


						{/* Define a "Error" route for unmatched routes */}
						<Route path="/error_page" element={<ErrorPage />} />
						<Route path="*" element={<ErrorPage />} />

					</Routes>
				</div>

			</MyState>
		</>
	);
}

export default App;
