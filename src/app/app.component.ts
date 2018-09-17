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
	tournamentTeams: ITeam[];

	constructor(
		private http: HttpClient
	) {
		this.tournamentUrl = "https://smash.gg/admin/tournament/api-testing/seeding/210415/389726";
	}

	onTournamentUrlChange(value) {
		this.tournamentUrl = value;
	}

	async submitUrl() {
		const tournamentData: ITournamentData = this.parseTournamentData(this.tournamentUrl);

		const tournamentUrl: string = `https://cors-anywhere.herokuapp.com/https://api.smash.gg/tournament/${tournamentData.name}?expand[]=participants`;
		const tournamentParticipants: IParticipant[] = await this.getTournamentParticipants(tournamentUrl);

		const eventUrl: string = `https://cors-anywhere.herokuapp.com/https://api.smash.gg/event/${tournamentData.eventId}?expand[]=entrants`; 
		this.tournamentTeams = await this.getTournamentTeams(eventUrl, tournamentParticipants);
	}

	parseTournamentData(url: string): ITournamentData {
		const name: string = url.match(/(?<=tournament\/)[^\/]*/)[0];
		const eventAndPhaseIdArray: string[] = url.match(/(?<=seeding\/)[^\$]*/)[0].split("/");
		const eventId: number = parseInt(eventAndPhaseIdArray[0]);
		const phaseId: number = parseInt(eventAndPhaseIdArray[1]);
		return { name, eventId, phaseId };
	};

	findParticipantTag(participantId: number, participants: IParticipant[]): string {
		let foundParticipant: IParticipant = participants.find((participant: IParticipant) => {
			return participant.id === participantId;
		});
		return foundParticipant.tag;
	};

	getTournamentParticipants(tournamentUrl: string): Promise<IParticipant[]> {
		return this.http.get(tournamentUrl)
		.toPromise()
		.then((data: any) => {
			return data.entities.participants.map((participant: any) => {
				return {
					id: participant.id,
					tag: participant.gamerTag
				};
			});
		});
	};

	getTournamentTeams(eventUrl: string, tournamentParticipants: IParticipant[]): Promise<ITeam[]> {
		return this.http.get(eventUrl)
		.toPromise()
		.then((data: any) => {
			return data.entities.entrants.map((entrant: any) => {
				const player1Tag: string = this.findParticipantTag(entrant.participantIds[0], tournamentParticipants);
				const player2Tag: string = this.findParticipantTag(entrant.participantIds[1], tournamentParticipants);

				return {
					name: entrant.name,
					player1Tag,
					player2Tag
				};
			});
		});
	};
}
