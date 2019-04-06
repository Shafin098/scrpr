const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const ejs = require('ejs');
const compression = require('compression')
const cors = require('cors');
const app = express();

const PORT = 3000;
let stocks = [];
let status;
const url = 'http://www.dsebd.org/dseX_share.php';
const option = {  
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Charset': 'utf-8',          
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
}
try {
request(url, function(error, response, body) {
            console.log('error:', error); 
            console.log('statusCode:', response && response.statusCode);
            
            if (response != undefined ) {
                const $ = cheerio.load(body);

                let b = $('b').text().split(/\s+/); 
                //market status  
                status = b[11]      
                console.log(status);
                let stock_name = [];
                let data;
                $('a.abhead').each(function(i, elem) {
                    stock_name[i] = $(this).text();
                    data = stock_name[i].trim().split(/\s+/);//split name ticker ltp percent to array
                    stocks.push(data);
                });
                let final_data = {};
                if (data != undefined) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        final_data.stock = data[i];
                    }
                }
                console.log(stocks[6]);
            }
	});
} catch (err) {	
	console.log(err.message);
}

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
    console.log(`Listening at port ${process.env.PORT ||PORT}`);
    console.log('started');
});


let refresh_data = function() {
	try {
    request(url, function(error, response, body) {
        if (error == null) {
                stocks.length = 0;
                // console.log('error:', error); 
                // console.log('statusCode:', response && response.statusCode); 
                
                if (response != undefined) {
                const $ = cheerio.load(body);
                let stock_name = [];
                let data;
                $('a.abhead').each(function(i, elem) {
                    stock_name[i] = $(this).text();
                    data = stock_name[i].trim().split(/\s+/);//split name ticker ltp percent to array
                    stocks.push(data);
                });
                let final_data = {};
                if (data != undefined) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        final_data.stock = data[i];
                    }
                }
                // console.log("refreshed data");
            } 
    }
        
    });
		} catch (err) {
		console.log(err.message);
	}
};

setInterval(refresh_data, 20000);
