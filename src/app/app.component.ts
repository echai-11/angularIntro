import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'conFusion';
}

//properties, methods defined in component can be retrieved in template
//event-binding: events in template can be bound to methods defined in component
