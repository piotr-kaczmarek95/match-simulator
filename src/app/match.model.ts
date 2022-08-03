export class Match{

    home: any
    away: any

    constructor(homeTeamName: string, awayTeamName: string){
        this.home = {name: homeTeamName, score: 0}
        this.away = {name: awayTeamName, score: 0}
    }    
}