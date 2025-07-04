import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})



export class CountryService {

  constructor() { }

  plivoBrowserSdk: any;

 countries = [ {
  name:"United States",
  code:"us",
  countrycode:"+1"

 },
 {
  name:"India",
  code:"in",
  countrycode:"+91"

 },
 {
  name:"Australia",
  code:"au",
  countrycode:"+61"

 },
 {
  name:"United Kingdom",
  code:"gb",
  countrycode:"+44"

 }
]


plivoLogin(){

  if (window.Plivo) {
    const options = {
      debug: "DEBUG",
      permOnClick: true,
      audioConstraints: {
        optional: [
          { googAutoGainControl: true },
          { googEchoCancellation: true }
        ]
      },
      enableTracking: true
    };

   
    this.plivoBrowserSdk = new window.Plivo(options);


    const username = 'Vivek161225762122349537958';
    const password = 'Ivis123-789';
    this.plivoBrowserSdk.client.login(username, password);

  
    this.plivoBrowserSdk.client.on('onLogin',()=>{
      // console.log("Login Successful")
    });



    this.plivoBrowserSdk.client.on('onLoginFailed', (error: any) => {
     
      alert("Login failed. Please check your credentials.")
    });
  } 

}



  
}
