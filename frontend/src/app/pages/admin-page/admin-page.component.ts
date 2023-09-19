import { Component, HostListener, OnInit  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbService, Breadcrumb } from 'angular-crumbs';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  constructor(
    private titleService: Title, private breadcrumbService: BreadcrumbService
    ) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbChanged.subscribe( crumbs => {
      this.titleService.setTitle(this.createTitle(crumbs));
    })
  }

  nombre: string;

  private createTitle(routesCollection: Breadcrumb[]){
    const title = 'Administración';
    const titles = routesCollection.filter((route) => route.displayName);

    if(!titles.length) {
      return title;
    }

    const routeTitle = this.titlesToString(titles);
    return `${routeTitle} ${title}`;

  }

  private titlesToString(titles: any) {
    return titles.reduce((prev: any, curr: any) => {
      return `${curr.displayName} - ${prev}`;
    }, '');
  }

}
