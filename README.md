# Stock Visualizer
Stock visualizer is an application which is used to for 2 purposes, they are:<br/>
- To visualize the behaviour of a stock using box-plot graph from the given data and given time interval.<br/>
- To help portfolio manager in comparing the selected Mutual fund stocks behaviour with the remaining stocks using
 the given data.<br/>
**Conditions included:**
- Application reads the input stocks data from all_stocks_5yr.csv file in StockVisualizer/src/data directory
.<br/>
  Given data contains stock data of S&P 500 stocks prices over the span of 5 years.<br/>
**Task 1:**<br/>
- Application filters the data from the selected stock and selected time frame among the data from file. And uses
 filtered data to draw the Graph.<br/>
- Application draws the graph using d3js by defining domain and ranges for axes based on the filtered data.<br/>
- Box-plots are designed based on the open and closed price of stock.
- Box-plot with profit is shown as green color, and the box-plot with loss is shown in red color.<br/>
- Median line is drawn indicating the overall median price among the selected date range for selected stock.
**Task 2:**<br/>
- Application gets the stocks selected for Mutual fund with corresponding percentages for stocks as environment
 variables(Which are pre-defined by portfolio manager) from .env file(Present in StockVisualizer/.env).<br/>
- Filters the data by using the MF stocks with percentages and amount to invest on specific date from input.
- Profit or Loss percentage is calculated for each stock on each day.
- Line graph is drawn for both MF stocks and Non-MF stocks using the data filtered for Profit or Loss percentage over
 day to day.
 - Time interval for the comparing line graph is taken from .env file as last 3 months, 6 months or 9 months.(defined
  by portfolio manager) <br/>

**Technologies used:**
1. D3js
2. React
    
**Requirements:**
- Node
- Internet connection (for d3js library)

**Steps to run:** Use below commands, Inside the project directory.
- Install the node modules<br/>
<pre><code> npm install </code></pre>
- Run the application<br/>
<pre> <code> npm start </code></pre>
**For Task 1:**
<br/> Access the application on <pre>localhost:3000</pre>
**For Task 2:**
<br/> Access the application on <pre>localhost:3000/compare-stocks</pre>
- Run all tests<br/>
<pre> <code> npm test</code></pre>