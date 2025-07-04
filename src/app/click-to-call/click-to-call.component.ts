import { Component, OnInit } from '@angular/core';

import { CountryService } from '../../services/country.service';
import { AlertService } from 'src/services/alert.service';

// Declare the Plivo Browser SDK global variable.
// (Ensure the script is loaded via index.html.)



@Component({
  selector: 'app-click-to-call',
  templateUrl: './click-to-call.component.html',
  styleUrls: ['./click-to-call.component.css']
})
export class ClickToCallComponent  {
  // Form fields for the click-to-call feature.
  phoneMeNumber: string = '';

  
  endpoint: string = '';
  password: string = '';
  message: string = 'Idle...';
  startDate: Date = new Date();
  display: string = '00:00:00';
  interval: any;


  constructor(private countryService :CountryService,
              private alertSnack:AlertService,
  ) { }

  countries: any[] = [];

  country: string = '+1';
  selectedCountry: string = 'us';

  ngOnInit(): void {


    this.countries = this.countryService.countries;

    

  }




  countryPrefix(country:any){

 this.dialedNumber=country.countrycode;
 this.selectedCountry=country.code;

  }




  phoneStatus:any="Idle..."

   ngAfterViewInit() {

    //  Registering event listeners on PlivoBrowserSdk client after view initialization
    this.countryService.plivoBrowserSdk.client.on('onCallRemoteRinging', () => {
      this.onCallRemoteRinging();  
    });

    this.countryService.plivoBrowserSdk.client.on('onCalling',()=>{

      this.onCalling();
    });
  
    this.countryService.plivoBrowserSdk.client.on('onCallAnswered',()=>{
      this.onCallAnswered();
    });

    this.countryService.plivoBrowserSdk.client.on('onCallTerminated',()=>{
      this.onCallTerminated();
    });
    

    this.countryService.plivoBrowserSdk.client.on('onCallFailed',()=>{
      this.onCallFailed();

    } );

 
    this.countryService.plivoBrowserSdk.client.on('onIncomingCall',()=>{
      this.onIncomingCall();

    } );

    this.countryService.plivoBrowserSdk.client.on('onIncomingCallCanceled',()=>{
      this.onIncomingCallCanceled();
    });
    this.countryService.plivoBrowserSdk.client.on('mediaMetrics', this.mediaMetrics);

    
  }


  dialedNumber: string = '+1';
  keys: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  pressKey(key: string) {

    this.dialedNumber += key;
  }

  clear() {
    this.dialedNumber = '+1';
    this.selectedCountry='us';
    this.country = '+1';
  }

  checkDevices(){

    
  let freqDevices = {
    audioinput: 0,
    audiooutput: 0
  };


    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        
        if(device.kind=="audioinput"){
  
          freqDevices.audioinput++;
  
        }
        if(device.kind=="audiooutput"){
  
          freqDevices.audioinput++;
  
        }
      
      });
  
      if (freqDevices.audioinput > 1) {
        
      } else {
       this.alertSnack.snackError("Atleast one audioinput & one audiooutput should be present")
      }
  
     
    })
    .catch(error => {
      
   
    });

  }



  onCalling(){

    this.display = '00:00:00';

this.checkDevices();


   this.message="Calling...";
   
   this.callbtn=true; 
  

  }

  callbtn: boolean= false;

  onCallRemoteRinging(){

    this.message="Ringing...";
  }

  callAnswer:boolean=false;

  onCallAnswered(){

    this.startDate = new Date(); // Store the start time when the component is initialized
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
   
    this.callAnswer=true;
    this.message="Ongoing...";

  }
 
  updateTime(): void {
    const endDate = new Date();
    const elapsed = endDate.getTime() - this.startDate.getTime();
    let hours = Math.floor(elapsed / 3600000);
    let minutes = Math.floor((elapsed - hours * 3600000) / 60000);
    let seconds = Math.floor((elapsed - hours * 3600000 - minutes * 60000) / 1000);
  
    // Ensure hours, minutes, and seconds are numbers, and then format as strings
    const formattedHours = hours < 10 ? "0" + hours : hours.toString();
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds.toString();
  
    // Assign the final formatted time string
    this.display = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  onCallFailed(){

    this.message="Idle...";
    this.callbtn=false;
    this.checkDevices();
    this.alertSnack.snackError("Call Failed...")
    this.callAnswer=false;
    clearInterval(this.interval); 
 
  }
  onCallTerminated(){

    this.countryService.plivoBrowserSdk.client.hangup();
   
    this.callbtn=false;
    this.callAnswer=false;  

     this.message="Idle...";

     this.alertSnack.snackError("Hanging up!")

     clearInterval(this.interval); 

    

  }

  incomecall:boolean=false;
  onIncomingCall(){

    this.message="Incoming Call...";

    this.incomecall=true;

    this.alertSnack.snackSuccess("Incoming Call...");

  }
  onIncomingCallCanceled(){

    this.message="Idle...";
    this.incomecall=false;
    this.alertSnack.snackSuccess("Incoming Call Cancelled...");

  }

  mediaMetrics()
  {

  }

  sanitizeNumber(input:any) {
    let sanitized = input.replace('-','');
    sanitized     = sanitized.replace(' -','');
    sanitized     = sanitized.replace('- ','');
    sanitized     = sanitized.replace('+','');
    sanitized     = sanitized.replace(/\s+/g, '');
    return sanitized;
  }

  makeCall(){
  
    let dist= this.sanitizeNumber(this.dialedNumber); 
    const customCallerId = "+18444384847";
    const extraHeaders = {'X-PH-Test1': 'test1', 'X-PH-header1': customCallerId};
    this.countryService.plivoBrowserSdk.client.call(dist, extraHeaders);


  }

  mic:boolean=false;

  mute(index:number){

    switch (index) {

      case 1:
        this.mic=!this.mic;
        this.countryService.plivoBrowserSdk.client.mute();
        break;

      case 2: 
        this.mic=!this.mic;
        this.countryService.plivoBrowserSdk.client.unmute();
        break;

      default:
        break;

    }


  }
  
incomeCall(){
  this.countryService.plivoBrowserSdk.client.answer();
}

Reject(){
  this.message="Idle...";
  this.countryService.plivoBrowserSdk.client.reject();
}



}