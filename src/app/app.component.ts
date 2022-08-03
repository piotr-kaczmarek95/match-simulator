import { Component, OnInit} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DataService } from './data.service';
import { Match } from './match.model';
import { SimulationState } from './simulation-state.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dataService: DataService){}

  teams : string[]  = []
  matches : Match[] = []

  goalsInterval !: any
  matchTimeout !: any

  goalsIntervalDuration !: number 
  matchDuration !: number 
  totalGoals !: number 

  goalsCounter : number = 0
  simulationState : SimulationState = 'initial'
  mainButtonText : string = 'Start'

  simulationSetupVisible : boolean = false
  
  goalScored: EventEmitter<string> = new EventEmitter()
  resetMatch: EventEmitter<void> = new EventEmitter()

  showSimulationSetup(){
    this.simulationSetupVisible = true
  }

  onSetupClosed(){
    this.simulationSetupVisible = false
  }

  onSetupConfirmed(settings: {duration: number, goals: number}){

    this.simulationSetupVisible = false

    this.matchDuration = settings.duration
    this.goalsIntervalDuration = Math.floor(settings.duration/settings.goals)
    this.totalGoals = settings.goals

    this.setMatchPairs()
  } 

  onMainButtonClicked(){

    if (this.simulationState === 'initial' || this.simulationState === 'finished'){

      if (this.simulationState === 'finished') {
        this.goalsCounter = 0
        this.resetMatch.emit()
      }

      this.runSimulation()      
      return 
    }
    
    if(this.simulationState === 'in-progress'){
      this.finishSimulation()
      return
    }
  }

  runSimulation(){

    this.simulationState = 'in-progress'
    this.mainButtonText = 'Finish'

    this.matchTimeout = setTimeout(()=>{

      this.simulationState = 'finished'
      this.mainButtonText = 'Restart'
      clearInterval(this.goalsInterval)

    }, this.matchDuration * 1000)

    this.goalsInterval = setInterval(()=>{

      this.scoreGoal()
      this.goalsCounter++   

    }, this.goalsIntervalDuration * 1000)
  }

  scoreGoal(){
    const teamIndex = Math.floor(Math.random()*this.teams.length)
    this.goalScored.emit(this.teams[teamIndex])
  }

  finishSimulation(){

    clearInterval(this.goalsInterval)
    clearTimeout(this.matchTimeout)

    this.simulationState = 'finished'
    this.mainButtonText = 'Restart'

    const goalsRemainingToBeScored = this.totalGoals - this.goalsCounter

    for(let i=0; i<goalsRemainingToBeScored; i++){
      this.scoreGoal()
      this.goalsCounter++
    }
  }

  setMatchPairs(){ //@TODO 
    
    this.teams = this.dataService.getTeams()

    this.matches = []

    const teamsKeys: number[] = [...this.teams.keys()]

    this.goalsCounter = 0
    this.mainButtonText = 'Start'

    do{

      const idxInArrHome = Math.floor(Math.random()*teamsKeys.length)
      const idxHome = teamsKeys[idxInArrHome]
      teamsKeys.splice(idxInArrHome, 1)

      const idxInArrAway = Math.floor(Math.random()*teamsKeys.length)
      const idxAway = teamsKeys[idxInArrAway]
      teamsKeys.splice(idxInArrAway, 1)

      const newMatch = new Match(this.teams[idxHome], this.teams[idxAway])
      this.matches.push(newMatch)

    }while(this.matches.length*2 < this.teams.length)

  }
}
