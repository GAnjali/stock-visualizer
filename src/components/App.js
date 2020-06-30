import React from 'react';
import {Router, Route} from 'react-router-dom';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../styles/styles.css";
import history from './history';
import StockVisualizer from './StockVisualizer/index';
import CompareStocks from './CompareStocks/index';

const App = () => (
    <div>
        <Router history={history}>
            <Route exact path="/" component={StockVisualizer}/>
            <Route exact path="/compare-stocks" component={CompareStocks}/>
        </Router>
    </div>
);

export default App;