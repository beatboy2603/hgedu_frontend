import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
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

    let { items, handleParentSelect, source, defaultValue, disabled, selectLabel } = props;

    const [item, setItem] = React.useState(defaultValue ? defaultValue : "default");

    const handleChange = event => {
        setItem(event.target.value);
        if (handleParentSelect) {
            handleParentSelect(source, event.target.value)
        }
    };

    const menuItems = items.map((item, i) => {
        return <MenuItem key={i} value={item.value}>{item.text}</MenuItem>
    });

    return (
        <div>
            <FormControl className={classes.formControl}>
            <span className="blue-text text-darken-2">{selectLabel}</span>
                <Select
                    disabled={disabled}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    onChange={handleChange}
                >
                    <MenuItem value={"default"} disabled={true}>Chọn</MenuItem>
                    {/* <Temp setItem={setItem}></Temp>
                    <MenuItem value={"default"} disabled={true}>Chọn</MenuItem> */}
                    {menuItems}
                </Select>
                
            </FormControl>
        </div>
    );
}