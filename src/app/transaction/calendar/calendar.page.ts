import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ApplicationService} from '../../../services/application.service';
import { MenuController } from '@ionic/angular';
import {Location} from '@angular/common';
import * as d3 from 'd3';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-calendar',
    templateUrl: 'calendar.page.html',
    styleUrls: ['calendar.page.scss'],
})
export class CalendarPage implements OnInit {
    
    width = 0;
    height = 0;
    
    data = {};
    items = [];

    monthData = [];
    details = [];
    selectedMonthData = {};

    slideHeight = 0;
    slideShow = false;
    @ViewChild('sliding', { read: ElementRef }) sliding: ElementRef;
    
    month = [31, 30, 31, 28, 31, 30, 31, 31, 30, 31, 30, 31];
    
    constructor(private appService: ApplicationService,
        private _location: Location) {
    }

    ngOnInit() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.appService.getCalendar().subscribe(data => {
            this.data = data;
            this.monthData = this.data['monthData'];
            this.initMonthData();
        });
    }

    initMonthData() {
        _.each(this.monthData, (o, ii) => {
            let weekday = Number( moment(o['month'] + ' 1 ' + o['year'],
                'MMMM D YYYY').format('E'));
            if (7 === weekday) {
                weekday = 0;
            }
            const d = [];
            while (weekday-- > 0) {
                d.push({
                    'date': -1,
                    'spend': null,
                    'income':  null
                });
            }
            const days = this.getMonthDays(o['month'], o['year']);
            let i = 1;
            while (i <= days) {
                const f = _.find(o['dates'], oo => oo['date'] === i);
                d.push({
                    'date': i,
                    'spend': f ? f['spend'] : null,
                    'income': f ? f['income'] : null
                });
                i++;
            }
            this.monthData[ii]['dates'] = d;
        });
    }
    
    getAmountSum(strs) {
        return _.sumBy(strs, 'amount');
    }

    onBack() {
        this._location.back();
    }

    // str - november
    getMonthDays(month, year) {
        const m = Number(moment(month, 'MMMM').format('M'));

        return this.beLeapYear(year) && 2 === m ?
            this.month[m - 1] + 1 : this.month[m - 1];
    }

    beLeapYear(year) {
        year = Number(year);
        if (!year) {
            return false;
        }

        return year % 100 === 0 ? ( year % 400 === 0 ? true : false ) :
            ( year % 4 === 0 ? true : false );
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

    popWeekdayDetail(data, i, id) {
        if (this.getAmountSum(data['income']) === 0
            && this.getAmountSum(data['spend']) === 0) {
            return;
        }
        this.sliding.nativeElement.style.top = '6.7rem';
        this.slideShow = true;
        this.selectedMonthData = _.clone(this.monthData[i]);
        this.selectedMonthData['dates'] = 
            this.selectedMonthData['dates'].slice(Math.floor(id / 7) * 7,
            this.selectedMonthData['dates'].length <= (Math.floor(id / 7) + 1) * 7 ?
                this.selectedMonthData['dates'].length : (Math.floor(id / 7) + 1) * 7);
        this.details = _.union(data['income'], data['spend']);
        this.selectedMonthData['date'] = data['date'];
        console.log(this.selectedMonthData);
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
