import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'teamPlayers'})
export class TeamPlayers implements PipeTransform {
  transform(players: string[]): string {
    let teamPlayerString: string = "";
    players.forEach((player: string, index: number) => {
        if (index === 0) {
            teamPlayerString = `${player}`;
        } else if (index !== players.length - 1) {
            teamPlayerString += `, ${player}`;
        } else { // index === players.length - 1
            if (players.length > 2) teamPlayerString += ","
            teamPlayerString += ` & ${player}`;
        } 
    })
    return teamPlayerString;
  }
}