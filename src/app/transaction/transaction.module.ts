import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';


import { TransactionPage } from './transaction.page';
import { FilterPage } from './filter/filter.page';
import { IncomePage } from './income/income.page';
import { SpendPage } from './spend/spend.page';
import { BarChartPage } from './component/bar-chart/bar-chart.page';
import { CalendarPage } from './calendar/calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
        path: '',
        component: TransactionPage
    }, {
            path: 'filter',
            component: FilterPage
        }, {
            path: 'income',
            component: IncomePage
        }, {
            path: 'spend',
            component: SpendPage
        }, {
            path: 'calendar',
            component: CalendarPage
        }
    ])
  ],
  declarations: [TransactionPage, FilterPage,
      IncomePage, SpendPage, BarChartPage, CalendarPage]
})
export class TransactionPageModule {

}
