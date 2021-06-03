import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { NumberCommaService } from '../../services/number-comma.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    width = 0;
    height = 0;

    cards = [];
    details = [];
    data = {};
    activeCard = 3;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 2
    };

    slideHeight = 0;
    slideShow = false;
    @ViewChild('sliding', { read: ElementRef }) sliding: ElementRef;

    constructor(private appService: ApplicationService,
        private numberCommaService: NumberCommaService,
        private menu: MenuController,
        private router: Router) { }

    ngOnInit() {
        this.appService.getDashboard().subscribe(data => {
            this.cards = data['cards'];
            this.details = data['details'];
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        
    }

    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    }

    getNumber(percentage) {
        const n = percentage.substring(0, percentage.length - 1);
        return Number(n);
    }


    numberWithCommas(x) {
        var parts = String(x).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }

    getLowerCase(type) {
        return type.toLowerCase().replace(' ', '-');
    }

    slideMenuShow() {
        this.slideShow = true;
        const __ = this;
        setTimeout(function (o) {
            __.slideHeight = __.sliding.nativeElement.offsetHeight;
            __.sliding.nativeElement.style.top =
                (__.height - __.slideHeight) + 'px';
        }, 300);
    }

    slideMenuHide() {
        this.sliding.nativeElement.style.top = '100%';
        this.slideShow = false;
    }

    goToTransaction() {
        this.router.navigateByUrl('/transaction');
    }
}
