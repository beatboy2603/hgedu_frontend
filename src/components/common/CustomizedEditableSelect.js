import React, { Component } from 'react';
import DataListInput from 'react-datalist-input';

class CustomizedEditableSelect extends Component {
    /**
 * create your own match algorithm if you want to do so
 * @param currentInput String (the current user input)
 * @param item (one item of the items array)
 * @returns {boolean}
 */
    matchCurrentInput = (currentInput, item) => {
        let {handleParentSelect, source} = this.props;
        if(handleParentSelect){
            handleParentSelect(source, currentInput);
        }
        const yourLogic = item.someAdditionalValue;
        return (yourLogic.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase());
    };

    /**
     * your callback function gets called if the user selects one option out of the drop down menu
     * @param selectedItem object (the selected item / option)
     * @returns {*}
     */
    onSelect = (selectedItem) => {
        let {handleParentSelect, source} = this.props;
        if(handleParentSelect){
            handleParentSelect(source, selectedItem.value);
        }
    };

    render() {
        // the array you want to pass to the react-data-list component
        // each element at least needs a key and a label
        const items = this.props.items.map((item, i) => {
            return {
                // what to show to the user
                // label: item.id + ": " + item.name,
                value: item.value,
                label: item.text,
                // key to identify the item within the array
                key: i,
                // feel free to add your own app logic to access those properties later on
                someAdditionalValue: item.text,
            }
        });

        return (
            <div>
                <DataListInput
                    items={items} onSelect={this.onSelect} match={this.matchCurrentInput} />
            </div>
        );
    }
}

export default CustomizedEditableSelect;