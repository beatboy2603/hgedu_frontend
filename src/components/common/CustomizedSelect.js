import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function CustomizedSelect(props) {
    const classes = useStyles();
    const [item, setItem] = React.useState('');
    let { items, handleParentSelect, source } = props;

    const handleChange = event => {
        setItem(event.target.value);
        if (handleParentSelect) {
            handleParentSelect(source, event.target.value)
        }
    };

    const menuItems = items.map(item => {
        return <MenuItem value={item.value}>{item.text}</MenuItem>
    });

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    onChange={handleChange}
                    // onOpen={() => { setItem("default") }}
                >
                    {/* <Temp setItem={setItem}></Temp>
                    <MenuItem value={"default"} disabled={true}>Chọn</MenuItem> */}
                    {menuItems}
                </Select>
            </FormControl>
        </div>
    );
}

// class Temp extends Component {
//     componentDidMount() {
//         let {setItem} = this.props;
//         console.log("yeah");
//         setItem("default");
//     }
    
//     render(){
//         return(
//             // <MenuItem value={"default"} disabled={true}>Chọn</MenuItem>
//             <div></div>
//         )
//     }
// }