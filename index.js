const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const ejs = require('ejs');
const app = express();

let stocks = []


app.set('view engine', 'ejs');

app.get('/', function (req,res) {
	let name = []
	for (var i = 0; i < stocks.length; i++) {
	   	name.push(stocks[i][0]);

	}
	res.render('index', {data:stocks});
})

app.get('/data', function (req,res) {
	res.json(stocks);
})

app.use(function(req,res){
    res.render('error');
});

app.listen(process.env.PORT || 3000, function() {
	console.log('started');
});

let url ='http://www.dsebd.org/dseX_share.php';

request(url, function (error, response, body) {
	if (error) {
	console.log(error)
	}
	console.log('error:', error); // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	const $ = cheerio.load(body);
	let stock_name = []
    let data;
    $('a.abhead').each(function(i, elem) {
  	stock_name[i] = $(this).text();
  	data = stock_name[i].trim().split(/\s+/);
  	stocks.push(data)
	});
	let final_data = {};
	if (data != undefined) {
	for (var i = data.length - 1; i >= 0; i--) {
		final_data.stock = data[i];
		}
	}
	console.log(stocks.length);
	});

let refresh_data = function() { 
	stocks.length = 0;
	request(url, function (error, response, body) {
	if (error) {
	console.log(error)
	}
	console.log('error:', error); // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	const $ = cheerio.load(body);
	let stock_name = []
    let data;
    $('a.abhead').each(function(i, elem) {
  	stock_name[i] = $(this).text();
  	data = stock_name[i].trim().split(/\s+/);
  	stocks.push(data);
	});
	let final_data = {};
	if (data != undefined) {
	for (var i = data.length - 1; i >= 0; i--) {
		final_data.stock = data[i];
		}
	}
	console.log(stocks[6]);
	});
}

setInterval(refresh_data, 20000);
