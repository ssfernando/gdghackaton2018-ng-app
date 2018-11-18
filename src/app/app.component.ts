import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Device } from 'twilio-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items: any[] = [];
  device: any;
  showCall: Boolean = false;
  showHangup: Boolean = false;

  constructor(db: AngularFirestore) {
    db.collection('lonelyPeople').valueChanges().subscribe(result => {
      this.items = result;
    });
    fetch('https://byzantium-cheetah-8594.twil.io/capability-token')
    .then(response => response.json())
    .then((data: any) => {
        console.log('Got a token.');
        console.log('Token: ' + data.token);

        // Setup Twilio.Device
        this.device = new Device(data.token);

        this.device.on('ready', device => {
          this.showCall = true;
        });

        this.device.on('error', error => {
          console.log('Twilio.Device Error: ' + error.message);
        });

        this.device.on('connect', conn => {
          this.showCall = false;
          this.showHangup = true;
        });

        this.device.on('disconnect', conn => {
          this.showCall = true;
          this.showHangup = false;
        });
      })
      .catch(function (err) {
        console.log(err);
        console.log('Could not get a token from server!');
      });
  }

  call() {
    // get the phone number to connect the call to
    const randonPersonToCall = this.items[Math.floor(Math.random() * this.items.length)];
    var params = {
      To: randonPersonToCall.phoneNumber
    };

    console.log('Calling ' + params.To + '...');
    if (this.device) {
      this.device.connect(params);
    }
  }

  hangup() {
    // Bind button to hangup call
    console.log('Hanging up...');
    if (this.device) {
      this.device.disconnectAll();
    }
  }

}
