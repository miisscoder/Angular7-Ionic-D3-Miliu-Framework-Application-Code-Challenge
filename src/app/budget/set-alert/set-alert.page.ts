import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ApplicationService} from '../../../services/application.service';
import { MenuController } from '@ionic/angular';
import {Location} from '@angular/common';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
    selector: 'app-set-alert',
    templateUrl: 'set-alert.page.html',
    styleUrls: ['set-alert.page.scss'],
})
export class SetAlertPage implements OnInit {
    
    width = 0;
    height = 0;
    
    data = {};
    items = [];

    optionsBudget = ['Overall', 'My Income', 'My Spend', 'My Borrowings',
        'My Growth', 'My Protection'];
    selectedBudget = 'My Spend';
    expandBudget = false;

    optionsCategory = ['Consolodated', 'Risk Type'];
    selectedCategory = 'Consolodated';
    expandCategory = false;

    
    sliderValue = 50;
    
    constructor(private appService: ApplicationService,
        private _location: Location) {
    }

    ngOnInit() {
        this.appService.getSetAlert().subscribe(data => {
            this.data = data;
            this.items = data['items'];
            this.selectedBudget = data['selectedBudget'];
            const f = _.find(this.items, o => o['budgetHead'] === this.selectedBudget);
            if (f) {
                this.selectedCategory = f['category'];
                this.sliderValue = f['notify'].substring(0, f['notify'].length - 1);
            }
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    }



    onBack() {
        this._location.back();
    }

    onSave() {
        this._location.back();
    }

    onClickDropdownCategory() {
        if (this.selectedBudget !== 'Overall') {
            this.expandCategory = !this.expandCategory;
        }
        const f = _.find(this.items, o => o['budgetHead'] === this.selectedBudget);
        if (f) {
            if (this.selectedBudget !== 'Overall') {
                this.selectedCategory = f['category'];
            }
            this.sliderValue = f['notify'].substring(0, f['notify'].length - 1);
        }
    }

    onChange(event) {
        this.sliderValue = event.detail.value;
    }

    onSelectBudget(item) {
        this.selectedBudget = item;
    }
}
