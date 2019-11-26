import React, { useState, useEffect } from "react";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import { DatePicker } from "react-materialize";

const CustomizedDatePicker = (props) => {

    const [state, setState] = useState({ myDate: "" });

    let { handleParentState, width } = props;

    const formatDate = (date) => {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;
    }


    const handleChange = (e) => {
        const key = e.target.id;
        const val = e.target.value;

        const date = formatDate(val);

        const newState = { ...state };
        newState[key] = date;
        setState(newState);
        if (handleParentState) {
            handleParentState(val.getTime());
        }
    }

    return (
        <React.Fragment>
            <DatePicker style={{ width: width, height: "20px" }}
                value={state.myDate}
                id="dob"
                options={{ format: 'dd/mm/yyyy', minDate: new Date("1900-01-01"), maxDate: new Date() }}
                onChange={(newDate) => {
                    handleChange({
                        target: {
                            id: "myDate",
                            value: newDate
                        }
                    })
                }}
            />
        </React.Fragment>
    );
}

export default CustomizedDatePicker;