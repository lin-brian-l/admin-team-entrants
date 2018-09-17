import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators';

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
export class AppComponent implements OnInit {
	tournamentUrl: string;
	tournamentTeams: ITeam[];
	testNames: string[];
	searchTerm: FormControl = new FormControl();
	searchWord: string = "plz work";
	filteredNames: Observable<string[]>;

	constructor(
		private http: HttpClient
	) {
		console.log(this.searchWord);
		this.tournamentUrl = "https://smash.gg/admin/tournament/api-testing/seeding/210415/389726";
		this.testNames = ["test1", "asdf", "fdsa", "bvcx"];
		// this.searchTerm.valueChanges
		// .pipe(
		// 	startWith(""),
		// 	map()
		// )
		// .pipe(debounceTime(500))
		// .subscribe(data => {
		// 	console.log("data: " + data);
		// 	this.testNames = ["test2", "fdsa", "bvcx"];
		// 	this.searchWord = data;
		// 	console.log(`searchWord: ${this.searchWord}`)
		// })
	}

	ngOnInit() {
		this.filteredNames = this.searchTerm.valueChanges
		.pipe(
			startWith(''),
			map((value: string) => this.filterNames(value))
		);
	}

	filterNames(value: string): string[] {
		return this.testNames.filter((name: string) => name.includes(value));
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
