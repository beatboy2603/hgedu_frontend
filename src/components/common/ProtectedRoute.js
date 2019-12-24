import React from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";

function ProtectedRoute({ isAuthenticated, authenReq, userRole, roleReq, children, ...rest }) {
    const authorized=roleReq&&roleReq.filter((el, i)=>{
        return el===userRole;
    })
    return (
        <Route
            {...rest}
            render={({ location }) =>
                (!authenReq&&!isAuthenticated)||(authenReq&&isAuthenticated&&authorized.length==1) ? (
                    children
                ) : (
                        authenReq ? (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: location }
                                }}
                            />
                        ) : (
                                <Redirect
                                    to={{
                                        pathname: "/home",
                                        state: { from: location }
                                    }}
                                />
                            )
                    )
            }
        />
    );
}

export default ProtectedRoute;