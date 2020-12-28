const express = require('express');
const { google } = require('googleapis');//google的api
const keys = require('./keys.json');
const path = require('path');
const ejs = require('ejs');//記得命名網頁檔案
const app = express();
//npm install googleapis@39 --save
//npm i --save-dev nodemon 記得改package

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);


client.authorize(function (err, token) {
    if(err){ //測試有沒有err
        console.log(err);
        return;
    } else{
        console.log('Connected');//成功的通知
        gsrun(client);//第二階段再加
    }
});

//第一段測試連線

async function gsrun(cl){//cl就是client
    const gsapi = google.sheets({version:'v4', auth: cl});//打完之後在前面呼叫函式

    const opt = {//options
        spreadsheetId: '1JPD37qyw5yL8FEe-8dvJ4zTGTHocfDygbAsCVX5Y9NY',//複製sheets的id
        range: 'data!A1:H4'//工作表名稱&範圍
    };

    
    app.get('/', async function(req, res){
    let data = await gsapi.spreadsheets.values.get(opt);//await代表等待程式抓到表格的東西
    console.log(data);//先console.log這個一次看值在哪
    console.log(data.data);//再console.log這個一次看值在哪
    console.log(data.data.values);//最後console.log這個一次看值在哪
    let dataArray = data.data.values;//因為他是雙重陣列所以用陣列把它裝起來
        res.render('index',{data: dataArray});
    });
};


app.listen(3000, () => console.log('Server up and running'));//把網頁開在localhost:3000