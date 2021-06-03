import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { MenuController } from '@ionic/angular';
import { Location } from '@angular/common';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { PickerController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.page.html',
    styleUrls: ['filter.page.scss'],
})
export class FilterPage implements OnInit, OnDestroy {

    width = 0;
    height = 0;

    data = {};
    items = [];

    optionsBudget = ['All Accounts', 'Account-1', 'Account-2'];
    selectedBudget = 'All Accounts';
    expandBudget = false;

    optionsCategory = ['This Month', 'Last Month', 'This Quarter',
        'Last Quarter', 'This Year', 'Last Year', 'Custom'];
    selectedCategory = 'This Month';
    selectedCategoryId = 0;
    expandCategory = false;



    slideHeight = 0;
    slideShow = false;
    @ViewChild('sliding', { read: ElementRef }) sliding: ElementRef;

    pickerController = document.querySelector('ion-picker-controller');


    startDate = {
        day: '01',
        month: 'Dec',
        year: 2017
    };

    endDate = {
        day: '01',
        month: 'Dec',
        year: 2017
    };

    dates = [{ name: 'day', options: [] },
    { name: 'month', options: [] },
    { name: 'year', options: [] }];

    type = 0; // 0 is startdate, 1 is enddate
    constructor(
        public pickerCtrl: PickerController,
        private _location: Location) {
    }

    ngOnInit() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;


        this.addClass(document.querySelector('ion-app'),
            'filter-app');

        let index = 1;
        while (index <= 31) {
            this.dates[0]['options'].push({
                text: index,
                value: (index < 10 ? '0' + index : index)
            });
            index++;
        }
        index = 0;
        while (index < 12) {
            const dt = new Date(2010, index, 1);
            this.dates[1]['options'].push({
                text: moment().month(index).format('MMMM'),
                value: moment().month(index).format('MMM')
            });
            index++;
        }
        index = 1988;
        while (index <= 2050) {
            this.dates[2]['options'].push({ text: index, value: index });
            index++;
        }
    }

    ngOnDestroy() {
        this.removeClass(document.querySelector('ion-app'), 'filter-app');

    }

    async openPicker() {
        const picker = await this.pickerCtrl.create({
            buttons: [{
                text: 'START DATE',
                handler: (value) => {
                    this.type = 0;
                    return false;
                }
            }, {
                text: this.startDate.month.toLocaleLowerCase() + ' ' + this.startDate.day
                    + ',' + this.startDate.year,
                handler: (value) => {
                    this.type = 0;
                    return false;
                }
            }, {
                text: 'END DATE',
                handler: (value) => {
                    this.type = 1;
                    return false;
                }
            }, {
                text: this.endDate.month.toLocaleLowerCase() + ' ' + this.endDate.day
                    + ',' + this.endDate.year,
                handler: (value) => {
                    this.type = 1;
                    return false;
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Set',
                handler: (value) => {
                    // save data
                    this.pickerCtrl.dismiss();
                }
            }],
            columns: this.dates
        });
        await picker.present();
        
        picker.addEventListener('ionPickerColChange', async (event: any) => {
            const selectValue = event['detail']['options'][event['detail']['selectedIndex']]['value'];
            const selectName = event['detail']['name'];
            let d = d3.select(picker).selectAll('.picker-toolbar .picker-toolbar-button');
            if (this.type === 0) {
                selectName === 'day' ? this.startDate.day = selectValue
                    : (selectName === 'month' ? this.startDate.month = selectValue
                        : this.startDate.year = selectValue);
                d3.select(d['_groups'][0][1]).select('.picker-button')
                    .text(this.startDate.month + ' ' + this.startDate.day + ',' + this.startDate.year);
            } else {
                selectName === 'day' ? this.endDate.day = selectValue
                    : (selectName === 'month' ? this.endDate.month = selectValue
                        : this.endDate.year = selectValue);
                d3.select(d['_groups'][0][3]).select('.picker-button')
                    .text(this.endDate.month + ' ' + this.endDate.day + ',' + this.endDate.year);
            }
        });
    }


    onBack() {
        this._location.back();
    }

    onApply() {
        this._location.back();
    }

    onClickCategory(item, i ) {
        if (item === 'Custom') {
            this.openPicker();
            this.expandCategory = false;
        }
        this.selectedCategory = item;
        this.selectedCategoryId = i;
    }


    onSelectBudget(item) {
        this.selectedBudget = item;
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

    addClass(element, value) {
        if (element) {
            if (!element.className) {
                element.className = value;
            } else {
                const cn = element.className;
                element.className = cn + ' ' + value;
            }
        }
    }


    removeClass(element, value) {
        if (element && element.className) {
            if (element.className.trim() === value.trim()) {
                element.className = '';
            } else {
                const cn = element.className.replace(value, '');
                element.className = cn;
            }
        }
    }
}
