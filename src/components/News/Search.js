import SearchIcon from '@material-ui/icons/Search';
import React, { Component } from 'react';

class Search extends React.Component {
    render() {
        return(
            <div className="row">
                <div className="col" ><SearchIcon/></div>
                <div className="col s11"><input type="text" style={{border: "none"}} className="search-field" placeholder="Tìm kiếm" /></div>
            </div>
        )
    }
}

export default Search;