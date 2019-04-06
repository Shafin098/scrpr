const request = require('request');
const cheerio = require('cheerio');



const scrape = (url) => {
    let stocks = [];
    let status;
    const option = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    };
    try {
        request(url, function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);

            if (response != undefined) {
                const $ = cheerio.load(body);

                let b = $('b').text().split(/\s+/);
                //market status  
                status = b[11]
                console.log(status);
                let stock_name = [];
                let data;
                $('a.abhead').each(function (i, elem) {
                    stock_name[i] = $(this).text();
                    data = stock_name[i].trim().split(/\s+/); //split name ticker ltp percent to array
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
    return {stocks, status};
}

const refresh_data = (url, stocks) => {
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
module.exports.scrape = scrape;
module.exports.refresh_data = refresh_data;