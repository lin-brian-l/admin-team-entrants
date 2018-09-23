import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

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
	playerTags: string[]
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
	tournamentUrl: string;
	tournamentParticipants: IParticipant[];
	allTournamentTeams: ITeam[];
	filteredTeams: Observable<ITeam[]>;
	filterSearch: FormControl = new FormControl();
	autoCompleteOption: string = "";
	autoCompleteOptions: string[] = ["Team", "Player"];

	constructor(
		private http: HttpClient,
		private spinnerService: NgxSpinnerService
	) {
		this.tournamentUrl = "";
		// this.tournamentUrl = "https://smash.gg/admin/tournament/api-testing/seeding/210415/389726";
	}

	ngOnInit() {
		this.setFilteredNames();
	}

	setFilteredNames() {
		this.filteredTeams = this.filterSearch.valueChanges
		.pipe(
			startWith(''),
			map((search: string) => this.filterTeams(search))
		);
	}

	filterTeams(search: string): ITeam[] {
		const lowerCaseSearch = search.toLowerCase();
		return this.allTournamentTeams.filter((team: ITeam) => { 
			if (this.autoCompleteOption === "Team") {
				return team.name.toLowerCase().includes(lowerCaseSearch);
			} else { // this.autoCompleteOption === "Player"
				return team.playerTags.find((player: string) => {
					return player.toLowerCase().includes(lowerCaseSearch);
				})
			}
		});
	}

	async submitUrl() {
		this.spinnerService.show();
		const tournamentData: ITournamentData = this.parseTournamentData(this.tournamentUrl);
		this.tournamentParticipants = await this.getTournamentParticipants(tournamentData.name);
		this.allTournamentTeams = await this.getTournamentTeams(tournamentData.eventId);
		this.setFilteredNames();
		this.spinnerService.hide();
	}

	parseTournamentData(url: string): ITournamentData {
		const name: string = url.match(/(?<=tournament\/)[^\/]*/)[0];
		const eventAndPhaseIdArray: string[] = url.match(/(?<=seeding\/)[^\$]*/)[0].split("/");
		const eventId: number = parseInt(eventAndPhaseIdArray[0]);
		const phaseId: number = parseInt(eventAndPhaseIdArray[1]);
		return { name, eventId, phaseId };
	};
	
	getTournamentParticipants(tournamentName: string): Promise<IParticipant[]> {
		const tournamentUrl: string = `https://cors-anywhere.herokuapp.com/https://api.smash.gg/tournament/${tournamentName}?expand[]=participants`;
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
	
	getTournamentTeams(eventId: number): Promise<ITeam[]> {
		const eventUrl: string = `https://cors-anywhere.herokuapp.com/https://api.smash.gg/event/${eventId}?expand[]=entrants`; 
		return this.http.get(eventUrl)
		.toPromise()
		.then((data: any) => {
			return data.entities.entrants.map((entrant: any) => {
				const playerTags: string[] = entrant.participantIds.map((participantId: number) => {
					return this.findParticipantTag(participantId, this.tournamentParticipants);
				});

				return {
					name: entrant.name,
					playerTags
				};
			}).sort((teamA: ITeam, teamB: ITeam) => {
				if (teamA.name < teamB.name) return -1;
				if (teamA.name > teamB.name) return 1;
				return 0;
			})
		});
	};

	findParticipantTag(participantId: number, participants: IParticipant[]): string {
		let foundParticipant: IParticipant = participants.find((participant: IParticipant) => {
			return participant.id === participantId;
		});
		return foundParticipant.tag;
	};
};
