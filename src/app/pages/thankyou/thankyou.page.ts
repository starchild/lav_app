import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }
  back(){
    this.router.navigate(["/home"]);
  }
}
