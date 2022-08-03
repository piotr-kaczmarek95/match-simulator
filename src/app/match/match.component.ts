import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Match } from '../match.model';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input('match') match !: Match
  @Input('goalScored') goalScored!: EventEmitter<string>
  @Input('resetMatch') resetMatch!: EventEmitter<void>

  ngOnInit(): void {

    this.goalScored.subscribe((teamName)=>{

      if(teamName === this.match?.home.name){
        this.match.home.score++
        return
      }

      if(teamName === this.match?.away.name){
        this.match.away.score++
        return
      }
    })

    this.resetMatch.subscribe(()=>{
    
      if (this.match?.home && this.match?.away){
        this.match.home.score = 0
        this.match.away.score = 0
      }      
    })       
  }

  ngOnDestroy(): void {
    this.goalScored.unsubscribe()
    this.resetMatch.unsubscribe()
  }
}
