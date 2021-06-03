import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ApplicationService} from '../../services/application.service';
import { MenuController } from '@ionic/angular';
import * as d3 from "d3";

@Component({
    selector: 'app-blank',
    templateUrl: 'blank.page.html',
    styleUrls: ['blank.page.scss'],
})
export class BlankPage implements OnInit {
    budgetLeft = '';

    width = 0;
    height = 0;

    startX = 0;
    startY = 0;

    cardHeight = 122;
    cardWidth = 0;

    cards = [{
            text: 'My Budget',
            active: true,
            url:'/budget'
        }, {
            text: 'My Goals',
            active: true,
            url: '/transaction'
        }, {
            text: 'My Dashboard',
            active: true,
            url: '/dashboard'
        }, {
            text: 'My Advice',
            active: false,
            url: '/home'
        }, {
            text: 'My Spend',
            active: false,
            url: '/home'
        }, {
            text: 'My Growth',
            active: false,
            url: '/home'
        }, {
            text: 'My Borrowings',
            active: false,
            url: '/home'
        }, {
            text: 'My Protection',
            active: false,
            url: '/home'
        }];
    constructor(private appService: ApplicationService,
        private menu: MenuController) {

    }



    ngOnInit() {
        this.appService.getMoneyManagement().subscribe(data => {
            this.budgetLeft = this.numberWithCommas(data['budgetLeft']);
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.cardWidth = this.width / 3;
        this.cardHeight = this.cardWidth;
        this.initDrag();
    }

    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    }
    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }

    dragstarted() {
        this.startX = d3.event.subject.x
        this.startY = d3.event.subject.y;
    }

    dragged() {
        d3.event.subject.x = d3.event.x;
        d3.event.subject.y = d3.event.y;
        console.log(d3.event.x);
        console.log(d3.event.y);
    }

    dragended() {
        let endX = d3.event.x;
        let endY = d3.event.y;
        let offset = 0;

        offset = ((endY - this.startY) / this.cardHeight + 1) * 3
            + ((endX - this.startX) / this.cardWidth + 1);
    }

    initDrag() {
        d3.selectAll('.card').call(d3.drag()
            .subject(d => d == null ? { x: d3.event.x, y: d3.event.y } : d)
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended)
        );
    }

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}
