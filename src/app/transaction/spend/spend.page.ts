import { Component, OnInit  } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { Location } from '@angular/common';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
    selector: 'app-spend',
    templateUrl: 'spend.page.html',
    styleUrls: ['spend.page.scss'],
})
export class SpendPage implements OnInit {

    width = 0;
    height = 0;
    card = 0;
    data = {};
    diaryData = [];
    chartData = [];
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1
    };

    circles = [1.85, 1.65, 1.35, 1.15, 0.95];


    color = [{
            'category': 'Rent & Utilities',
            'color': '#08a5e1'
        }, {
            'category': 'Travel',
            'color': '#ffa700'
        }, {
            'category': 'Food',
            'color': '#ff5a5a'
        }, {
            'category': 'Shopping',
            'color': '#bc43d3'
        }, {
            'category': 'Tax',
            'color': '#47c684'
        }, {
            'category': 'Income',
            'color': '#08a5e1'
        }, {
            'category': 'Other Income',
            'color': '#ffa700'
        }];

    constructor(private appService: ApplicationService,
        private _location: Location) {
    }

    ngOnInit() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.card = this.width / (this.width + 16 * 2);

        this.appService.getSpend().subscribe(data => {
            this.data = data;
            this.diaryData = this.data['diary'];
        });

    }
    

    onBack() {
        this._location.back();
    }
    
    

    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    }

    getNumber(percentage) {
        const n = percentage.substring(0, percentage.length - 1);
        return Number(n);
    }


    numberWithCommas(x) {
        var parts = String(x).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }


    getLowerCase(type) {
        const result = type.toLocaleLowerCase().replace(' & ', '-');
        return result.toLowerCase().replace(' ', '-');
    }

}
