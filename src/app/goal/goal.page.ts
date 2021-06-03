import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { NumberCommaService } from '../../services/number-comma.service';
import { MenuController } from '@ionic/angular';
import { Location } from '@angular/common'; 
import * as _ from 'lodash';

@Component({
    selector: 'app-goal',
    templateUrl: 'goal.page.html',
    styleUrls: ['goal.page.scss'],
})
export class GoalPage implements OnInit {
    
    data = [];
    
    constructor(private appService: ApplicationService,
        private numberCommaService: NumberCommaService,
        private menu: MenuController,
        private _location: Location) {
    }

    ngOnInit() {
        this.appService.getGoal().subscribe(data => {
            this.data = data["data"];
        });
    }

    getIconClass(item) {
        return item ? String(item).toLocaleLowerCase().replace(' ', '-'): '';
    } 

    getIconName(type) {
        if ('Rent & Utilities' === type) {
            return 'rent-utilities';
        } else {
            return this.getIconClass(type);
        }
    }

    getNumber(percentage) {
        const n = percentage.substring(0, percentage.length - 1);
        return Number(n);
    }


    getProgressBarWidthPercentage(amount, goal) {
        return  amount /  goal > 1 ? '100%' : Math.floor( amount / goal * 100) + '%';
    }


    getPercentage(amount, goal) {
        return  Math.floor(amount / goal * 100) + '%';
    }

    getInteger(number) {
        return Math.floor(number);
    }

    getCommaNumber(number) {
        this.numberCommaService.execute(number);
    }

    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }

    getLowerCase(type) {
        return type.toLowerCase().replace(' ', '-');
    }

    onBack() {
        this._location.back();
    }
}
