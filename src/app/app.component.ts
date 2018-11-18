import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items: any[] = [];

  constructor(db: AngularFirestore) {
    db.collection('lonelyPeople').valueChanges().subscribe(result => {
      this.items = result;
    });
  }

  call() {
    const randonPersonToCall = this.items[Math.floor(Math.random() * this.items.length)];
    console.log(randonPersonToCall);
  }
}
