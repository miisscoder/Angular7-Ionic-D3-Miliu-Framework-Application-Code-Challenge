import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { MenuController } from '@ionic/angular';
import { Location } from '@angular/common';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { PickerController } from '@ionic/angular'

@Component({
    selector: 'app-set-goal',
    templateUrl: 'set-goal.page.html',
    styleUrls: ['set-goal.page.scss'],
})
export class SetGoalPage implements OnInit {
    
    width = 0;
    height = 0;
    
    data = {};

    name = 'Cancun Holidays';

    optionsFundingAccount = [];
    selectedFundingAccount = '';
    expandFundingAccount = false;

    amount = 900;

    optionsCategory = [];
    selectedCategory = '';
    expandCategory = false;
    startDate = 0;

    items = {
        name: 'Cancun Holidays',
        category: 'Travel',
        amount: '900',
        startDate: '01/01/2017',
        completionMonth: 12,
        completionYear: 2018,
        fundingAccount: '1234567890'};
    
    constructor(private appService: ApplicationService,
        private _location: Location,
        public pickercontroller: PickerController) {
    }

    ngOnInit() {   
        this.appService.getSetGoal().subscribe(data => {
            this.data = data;

            this.optionsCategory = data['category'];
            this.selectedCategory = data['category'].length > 0 ?
                data['category'][0] : '';

            this.optionsFundingAccount = data['fundingAccount'];
            this.selectedFundingAccount = data['fundingAccount'].length > 0 ?
                data['fundingAccount'][0] : '';
            
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

    onSelectCategory(item) {
        this.selectedCategory = item;
        this.items['category'] === this.selectedCategory;
    }
    

    onSelectFundingAccount(item) {
        this.selectedFundingAccount = item;
        this.items['fundingAccount'] === this.selectedFundingAccount;
    }
}
