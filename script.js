const addJQuery = () => {
	var jq = document.createElement('script');
	jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(jq);
}

const startScript = async () => {
	addJQuery();
	const tourneyData = getTourneyData();
	const tourneyAPI = `https://api.smash.gg/tournament/${tourneyData.name}?expand[]=phase&expand[]=groups&expand[]=event&expand[]=participants`;
	const tourneyAPIResults = JSON.parse(await makeCorsRequest(tourneyAPI));
	console.log("api result: " + tourneyAPIResults.result);

	// const tagDivs = $(".list-unstyled.striped.phase-seed-list").find(".gamertag-title");
	// tagDivs.each((index, child) => {
	// 	console.log(child.innerText);
	// })
}

const getTourneyData = () => {
	const pageUrl = window.location.href;
	const name = pageUrl.match(/(?<=tournament\/)[^\/]*/)[0];
	const eventAndPhaseIdArray = pageUrl.match(/(?<=seeding\/)[^\$]*/)[0].split("/");
	const eventId = eventAndPhaseIdArray[0];
	const phaseId = eventAndPhaseIdArray[1];
	return { name, eventId, phaseId };
}

const makeCorsRequest = (url) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
		}).done(response => {
			resolve(response);
		})

		// const xhr = new XMLHttpRequest();
		// xhr.onreadystatechange = (e) => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         resolve(xhr.response);
  //       } else {
  //         reject(xhr.status);
  //       }
  //     }
  //   }
  //   xhr.ontimeout = () => {
  //     reject('timeout');
  //   }
  //   xhr.open('get', url, true);
  //   xhr.send();
	})
}

// https://api.smash.gg/tournament/api-testing?expand[]=phase&expand[]=groups&expand[]=event&expand[]=participants
// https://api.smash.gg/tournament/api-testing?expand[]=groups // use this
// grab group IDs for specific phase

// https://api.smash.gg/phase_group/733190?expand[]=sets&expand[]=standings&expand[]=entrants&expand[]=seeds&expand[]=participants
// for each group ID, extract array of entrant objects and consolidate into one array

// for each tagDiv, set child.innerText equal to concatenation of gamerTags