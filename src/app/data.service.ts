import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class DataService{

    private defaultTeams : string[] = ['Germany', 'Poland', 'Brazil', 'Mexico', 'Argentina', 'Uruguay', 'Australia', 'Ghana']
    private teams: string[] = []

    getTeams(){
        return [...this.teams]
    }

    getDefaultTeams(){
        return[...this.defaultTeams]
    }

    setTeams(newTeams: string[]){
        this.teams = newTeams
    }
}