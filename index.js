const express = require('express');
const ejs = require('ejs');
const compression = require('compression')
const cors = require('cors');
const scrpr = require('./scrape');
const app = express();

const PORT = 3000;
const url = 'http://www.dsebd.org/dseX_share.php';

let {stocks, status} = scrpr.scrape(url);


//routes start here
app.use(express.static('public'))
// app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use(compression());
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    let name = [];
    for (var i = 0; i < stocks.length; i++) {
        name.push(stocks[i][0]);

    }
    res.render('index', {
        data: stocks,
        status: status
    });
});

app.get('/data', cors(), function(req, res, next) {
    res.json(stocks);
});

app.get('/ticker/:name', function(req,res) {
    let queryStock = req.params;
    // console.log(queryStock);
    res.render('stock', {
    	data: queryStock,
    	status: status});
});

app.use(function(req, res) {
    res.render('error');
});

app.listen(process.env.PORT || PORT, function() {
    console.log(`Listening at port ${process.env.PORT || PORT}`);
    console.log('started');
});

setInterval(() => scrpr.refresh_data(url, stocks), 20000);
