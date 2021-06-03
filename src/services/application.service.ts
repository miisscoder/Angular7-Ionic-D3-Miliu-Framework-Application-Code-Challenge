import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { delay, map } from 'rxjs/operators';

const MOCK_API_DELAY = 1000;

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    constructor(private helper: HelperService) {
    }

    /**
     * gets the applications
     * @returns  the applications data
     */
    get() {
        return this.helper.get('/assets/data/db.json').pipe(delay(MOCK_API_DELAY));
    }
    getApp() {
        return this.helper.get('/assets/data/GetApp.json').pipe(delay(MOCK_API_DELAY));
    }


    getMoneyManagement() {
        return this.helper.get('/assets/data/GetMoneyManagement.json').pipe(delay(MOCK_API_DELAY));
    }

    getDashboard() {
        return this.helper.get('/assets/data/GetDashboard.json').pipe(delay(MOCK_API_DELAY));
    }

    getBudget() {
        return this.helper.get('/assets/data/GetBudget.json').pipe(delay(MOCK_API_DELAY));
    }

    getSetAlert() {
        return this.helper.get('/assets/data/GetSetAlert.json').pipe(delay(MOCK_API_DELAY));
    }

    getTransactions() {
        return this.helper.get('/assets/data/GetTransactions.json').pipe(delay(MOCK_API_DELAY));
    }

    getIncome() {
        return this.helper.get('/assets/data/GetIncome.json').pipe(delay(MOCK_API_DELAY));
    }

    getSpend() {
        return this.helper.get('/assets/data/GetSpend.json').pipe(delay(MOCK_API_DELAY));
    }

    getCalendar() {
        return this.helper.get('/assets/data/GetCalendar.json').pipe(delay(MOCK_API_DELAY));
    }

    getGoal() {
        return this.helper.get('/assets/data/GetGoal.json').pipe(delay(MOCK_API_DELAY));
    }


    getSetGoal() {
        return this.helper.get('/assets/data/GetSetGoal.json').pipe(delay(MOCK_API_DELAY));
    }
}
