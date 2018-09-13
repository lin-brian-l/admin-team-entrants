const express = require('express');
const app = express();

// Controllers
const tournamentsController = require("./controllers/tournaments.js");

app.get('/', tournamentsController.Home);
app.get('/test', (req, res) => {
	res.send({
		cats: [{name: 'lilly'}, {name: 'lucy'}]
	});
})


app.listen(8000, () => {
	console.log('plz start server');
});