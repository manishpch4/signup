const mysql = require('mysql');

const connection = mysql.createConnection({
	host : '35.193.9.83',
    database : 'books',
    user : 'root',
    password : 'admin123'
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;