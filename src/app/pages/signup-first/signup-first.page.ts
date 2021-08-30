import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-signup-first',
  templateUrl: './signup-first.page.html',
  styleUrls: ['./signup-first.page.scss'],
})
export class SignupFirstPage implements OnInit {

  constructor(
    public router: Router,
    public location: Location,
  ) { }

  ngOnInit() {
  }

  next(){
    this.router.navigate(["/signup-second"]);
  }

  back() {
    this.location.back();
  }
}
