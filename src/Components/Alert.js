import React, { useContext } from 'react'
import MyContext from '../Context/MyContext';

export default function Alert() {

    // Using the function to get the data from the context
    const contextData = useContext(MyContext);
    // console.log(contextData.alert);

    return (
        contextData.alert && <div id='myAlert' className={`alert ${contextData.alert.type} alert-dismissible fade show`} role="alert">
            <strong>{contextData.alert.title} !</strong> {contextData.alert.msg}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}
