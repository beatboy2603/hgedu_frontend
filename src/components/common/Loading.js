import React from 'react';
import ReactLoading from 'react-loading';

export const Loading = ({ type, color }) => (

    <div style={{
        position: "fixed",
        top: "50vh",
        left: "50vw",
    }}>
        <ReactLoading type={type} color={color} height={'25px'} width={'25px'} />
    </div>

);