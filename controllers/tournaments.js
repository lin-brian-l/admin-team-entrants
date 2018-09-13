exports.Home = (req, res) => {
	console.log("home is being hit");
	return res.send({
		cats: [{name: 'lilly'}, {name: 'lucy'}]
	});
}