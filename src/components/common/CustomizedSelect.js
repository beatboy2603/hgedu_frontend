import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SelectInput from '@material-ui/core/Select/SelectInput';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function CustomizedSelect({handleParentSelect, items}) {
    const classes = useStyles();
    const [item, setItem] = React.useState('');

    const handleChange = event => {
        setItem(event.target.value);
        if(handleParentSelect){
            handleParentSelect(event.target.value);
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
                >
                
                    {menuItems}
                </Select>
                
            </FormControl>
        </div>
    );
}