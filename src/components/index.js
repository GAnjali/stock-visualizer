import React from 'react';
import {Router, Route} from 'react-router-dom';
import history from './history';
import StockVisualizer from '../components/StockVisualizer/App';
import CompareStocks from '../components/CompareApp/App';

function App() {
    return (
        <div className="App">
            <Router history={history}>
                <Route exact path="/" component={StockVisualizer}/>
                <Route exact path="/compare-stocks" component={CompareStocks}/>
            </Router>
        </div>
    );
}

export default App;