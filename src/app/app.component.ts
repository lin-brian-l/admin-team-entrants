import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

interface ITournamentData {
	name: string,
	eventId: number,
	phaseId: number
}

interface IParticipant {
	id: number,
	tag: string	
}

interface ITeam {
	name: string,
	player1Tag: string,
	player2Tag: string
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	tournamentUrl: string;

	constructor(
		private http: HttpClient
	) {}

	onTournamentUrlChange(value) {
		this.tournamentUrl = value;
	}

	submitUrl(): void {
		// console.log(`button was hit: ${this.tournamentUrl}`);
		const tournamentData: ITournamentData = this.parseTournamentData(this.tournamentUrl);
		console.log(`url is https://cors-anywhere.herokuapp.com/https://api.smash.gg/tournament/${tournamentData.name}?expand[]=phase&expand[]=groups&expand[]=event&expand[]=participant`);
		this.http.get(`https://cors-anywhere.herokuapp.com/https://api.smash.gg/tournament/${tournamentData.name}?expand[]=phase&expand[]=groups&expand[]=event&expand[]=participant`)
		.subscribe((data: any) => {

			/*
				1) Grab array of participants
				2) Go to event url (https://api.smash.gg/event/210415?expand[]=entrants&expand[]=participants&expand=entrants) and grab array of entrants
				3) Map team array using array of entrants 
			*/

			// console.log(data.entities.groups);
			// let groupIds: number[] = data.entities.groups
			// .filter((group: any) => {
			// 	return group.phaseId == tournamentData.phaseId;
			// }).map((group: any) => {
			// 	return group.id;
			// })
			
			// const teamObjsgroupIds.forEach((groupId: number) => {
			// 	this.getGroupInfo(groupId);
			// })
		})
	}

	parseTournamentData(url: string): ITournamentData {
		const name: string = url.match(/(?<=tournament\/)[^\/]*/)[0];
		const eventAndPhaseIdArray: string[] = url.match(/(?<=seeding\/)[^\$]*/)[0].split("/");
		const eventId: number = parseInt(eventAndPhaseIdArray[0]);
		const phaseId: number = parseInt(eventAndPhaseIdArray[1]);
		return { name, eventId, phaseId };
	}

	getGroupInfo(groupId: number): void {
		this.http.get(`https://cors-anywhere.herokuapp.com/https://api.smash.gg/phase_group/${groupId}?expand[]=entrants`)
		.subscribe((data: any) => {
			console.log(`group Id is ${groupId} and phaseId is ${data.entities.groups.phaseId}`);
		})
	}
}
