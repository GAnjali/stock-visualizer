import React, {Component} from 'react';
import DropDown from './DropDown';

const arrayOfData = [{
    id: '1 - Jerry',
    name: 'Jerry'
},
    {
        id: '2 - Elaine',
        name: 'Elaine'
    },
    {
        id: '3 - Kramer',
        name: 'Kramer'
    },
    {
        id: '4 - George',
        name: 'George'
    },];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 'Nothing selected',
        }
    }

    handleSelectChange = (selectedValue) => {
        this.setState({
            selectedValue: selectedValue
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Stock Visualizer</h1>
                </header>
                <div className="App-intro">
                    <DropDown arrayOfData={arrayOfData} onSelectChange={this.handleSelectChange}/> <br/><br/>
                    <div>
                        Selected value: {this.state.selectedValue}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;