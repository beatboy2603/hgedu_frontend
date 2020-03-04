import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

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
    const inputLabelRef = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        if(inputLabelRef.current){
            setLabelWidth(inputLabelRef.current.offsetWidth);
        }
    }, []);

    let { items, handleParentSelect, source, defaultValue, disabled, selectLabel, inputLabel } = props;

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
            <FormControl variant="outlined" className={classes.formControl}>
                <span className="blue-text text-darken-2">{selectLabel}</span>
                {inputLabel && <InputLabel ref={inputLabelRef}>
                    {inputLabel}
                </InputLabel>}
                <Select
                    disabled={disabled}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    onChange={handleChange}
                    labelWidth={labelWidth}
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