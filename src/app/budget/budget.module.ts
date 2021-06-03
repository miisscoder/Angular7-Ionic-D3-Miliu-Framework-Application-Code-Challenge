import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';

import { BudgetPage } from './budget.page';
import { SetAlertPage } from './set-alert/set-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxBootstrapSliderModule,
    RouterModule.forChild([{
        path: '',
        component: BudgetPage
    }, {
            path: 'alert',
            component: SetAlertPage
        }
    ])
  ],
  declarations: [BudgetPage, SetAlertPage]
})
export class BudgetPageModule {
}
