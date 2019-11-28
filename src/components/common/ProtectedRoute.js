import React from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";

function ProtectedRoute({ isAuthenticated, authenReq, userRole, roleReq, children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated == authenReq ? (
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