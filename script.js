const addJQuery = () => {
	// console.log("adding jQuery");
	var jq = document.createElement('script');
	jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(jq);	
	// console.log("before setTimeout");
	// setTimeout(() => { 
	// 	jQuery.noConflict(); 
	// 	console.log("after noConflict()");
	// }, 1000)
}

const startScript = () => {
	// console.log("starting script");
	addJQuery();
	const tagDivs = $(".list-unstyled.striped.phase-seed-list").find(".gamertag-title");
	tagDivs.each((index, child) => {
		console.log(child.innerText);
	})
}

// find tourney name and phase ID from URL

// https://api.smash.gg/tournament/api-testing?expand[]=phase&expand[]=groups&expand[]=event&expand[]=participants
// grab group IDs for specific phase

// https://api.smash.gg/phase_group/733190?expand[]=sets&expand[]=standings&expand[]=entrants&expand[]=seeds&expand[]=participants
// for each group ID, extract array of entrant objects and consolidate into one array

// for each tagDiv, set child.innerText equal to concatenation of gamerTags