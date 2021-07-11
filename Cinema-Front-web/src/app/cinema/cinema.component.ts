import { Component, OnInit } from '@angular/core';
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {


  public villes: any ; public cinemas: any;
  public  currentVille: any;
  public currentCinema: any;
  public salles: any;
  public currentProjection: any;
  public selectedTickets: any;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, err => {
        console.log(err);

      })

  }

  onGetCinemas(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, err => {
        console.log(err);

      })

  }

  onGetSalles(c: any) {
    this.currentVille=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach((salle: any)=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);

            })
        })


      }, err => {
        console.log(err);

      })

  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection=p;
    console.log(p);
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets=[];
      }, err => {
        console.log(err);

      })
  }

  onSelectTicket(t: any) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
    else{
      t.selected=false;
      this.selectedTickets.slice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);

  }

  getTicketClass(t: any) {
    let str="btn ticket ";
    if(t.reserve==true){
      str+="btn-danger";

    }
    else if(t.selected){
      str+="btn-warning";
    }
    else{
      str+="btn-success";
    }
    return str;



  }


  onPayTickets(daTaForm: any) {

    let  tickets: any[]=[];
    this.selectedTickets.forEach((t: any)=>{
      tickets.push(t.id);
    });
    daTaForm.tickets=tickets;
    this.cinemaService.payerTickets(daTaForm)
      .subscribe(data => {
        alert("Tickets Reserve avec success");
        this.onGetTicketsPlaces(this.currentProjection);
      }, err => {
        console.log(err);
      })
  }
}
