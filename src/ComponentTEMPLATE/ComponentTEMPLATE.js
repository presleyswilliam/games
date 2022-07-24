import React, { useState, useEffect } from 'react';

export default function ComponentTEMPLATE (props) {
/* API */
    async function expressAPI(param0, param1) {
        const response = await fetch('/swapHandCard/' + param0 + '/' + param1);
        const data = await response.json();
        // console.log(data);
        return data;
    }

    function socketIO_API() {
        window.socket.emit('event-name', (response) => {    // This is a callback function that can be called from server
            console.log(response);
        })
    }
    

/* Variables */
    const [variable, setVariable] = useState('initialState');
    const [intervalRef, setIntervalRef] = useState();

    useEffect(() => {
        setIntervalRef(setInterval(functionName, 1000));

        return clearInterval(intervalRef);  // Teardown function
    }, []); // Initializes because of empty array dependency


/* Functions */


/* CSS Classes */
    let exampleClass = () => ({
        backgroundColor: "red"
    });


/* JSX */
    let componentTEMPLATEJSX;
    componentTEMPLATEJSX = <div style={{...exampleClass(), height: "50%", width: "50%"}}>This is a template for components</div>;

    return (
        <div>
            {componentTEMPLATEJSX}
        </div>
    );
}