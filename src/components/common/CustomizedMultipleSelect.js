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

    let { items, handleParentSelect, source, defaultValue, disabled, customStyle, selectLabel, inputLabel } = props;

    const [item, setItem] = React.useState(defaultValue ? defaultValue : []);

    const handleChange = event => {
        console.log("b");
        setItem(event.target.value);
        if (handleParentSelect) {
            handleParentSelect(source, event.target.value)
        }
    };

    const selectAll = () => {
        console.log("a");
        if (item.length != items.length) {
            const values = items.map((el, i) => {
                return el.value;
            })
            setItem(values);
            if (handleParentSelect) {
                handleParentSelect(source, values)
            }
        } else {
            setItem([]);
            if (handleParentSelect) {
                handleParentSelect(source, [])
            }
        }
    }

    const menuItems = items.map((item, i) => {
        return <MenuItem key={i} value={item.value}>{item.text}</MenuItem>
    });

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <span className="blue-text text-darken-2" style={{ cursor: "pointer" }} onClick={() => { selectAll() }}>{selectLabel}</span>
                {inputLabel && <InputLabel ref={inputLabelRef}>
                    {inputLabel}
                </InputLabel>}
                <Select
                    multiple
                    disabled={disabled}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    onChange={handleChange}
                    style={customStyle}
                    labelWidth={labelWidth}
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