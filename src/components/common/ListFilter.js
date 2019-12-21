import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';

class ListFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchValue: '',
            searchList: [],
        }
        
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(nextProps.searchList) !== JSON.stringify(this.props.searchList)) {
            if(JSON.stringify(nextProps.searchList) !== JSON.stringify(this.state.searchList)) {
                this.setState({searchList: nextProps.searchList});
            }
        }
    }

    handleChange = (e) => {
        if(e.target) {
            this.setState({searchValue: e.target.value})
            if(this.state.searchList && e.target.value) {
                var pattern = new RegExp(e.target.value, "ig");
                let searchResult = this.state.searchList.filter(item => pattern.test(JSON.stringify(item)));
                console.log("search result", searchResult)
                this.props.updateSearchResult(searchResult);
            }
        }
    }

    render() {
        return(
            <div className="search-box">
                 <Grid container alignItems="flex-end" className="search-list">
                    <Grid item>
                        <SearchIcon/>
                    </Grid>
                    <Grid item>
                        <TextField id="input-with-icon-grid" className="search-input" label="Tìm kiếm" value={this.state.searchValue} onChange={this.handleChange} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ListFilter;