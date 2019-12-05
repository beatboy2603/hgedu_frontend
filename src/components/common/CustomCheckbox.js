import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const checkBoxStyles = theme => ({
    root: {
      '&$checked': {
        color: '#03a1fc',
      },
    },
    checked: {},
   })

export const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);