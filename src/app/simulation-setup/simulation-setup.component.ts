import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-simulation-setup',
  templateUrl: './simulation-setup.component.html',
  styleUrls: ['./simulation-setup.component.css']
})
export class SimulationSetupComponent implements OnInit {

  constructor(private dataService: DataService) { }

  @Output() closeModal = new EventEmitter<void>()
  @Output() confirmModal = new EventEmitter<{duration: number, goals: number}>()

  setupForm!: FormGroup
  numberOfTeamsAllowed = [2, 4, 6, 8]  

  ngOnInit(): void {
    this.setupForm = new FormGroup({
      duration : new FormControl(null, [Validators.required, Validators.max(90), Validators.min(10), Validators.pattern(/^[1-9]+[0-9]*$/)]),
      goals : new FormControl(null, [Validators.required, Validators.max(20), Validators.min(1), Validators.pattern(/^[1-9]+[0-9]*$/)]),
      teams : new FormControl(null, [Validators.required]),
      teamsNames: new FormArray([])
    })
  }

  closeSetup(){
    this.closeModal.emit()
  }

  setDefaultValues(){
    this.setupForm.patchValue({duration: 10, goals: 9, teams: 6})
    this.onNumberOfTeamsSet()
    this.setupForm.patchValue({teamsNames: this.dataService.getDefaultTeams().slice(0, 6)})
  }

  saveSettings(){   
    this.dataService.setTeams(this.setupForm.value.teamsNames)
    this.confirmModal.emit({duration: this.setupForm.value.duration, goals: this.setupForm.value.goals})
  }

  clearForm(){
    this.setupForm.reset();
    (<FormArray>this.setupForm.controls['teamsNames']).clear();
  }

  onNumberOfTeamsSet(){
 
    (<FormArray>this.setupForm.controls['teamsNames']).clear();   

    for (let i=0; i<this.setupForm.value.teams; i++){
      (<FormArray>this.setupForm.get('teamsNames')).push(new FormControl(null, Validators.required));
    }      
  } 

  getTeamsNamesControls(){
    return (<FormArray>this.setupForm.get('teamsNames')).controls;
  }
}
