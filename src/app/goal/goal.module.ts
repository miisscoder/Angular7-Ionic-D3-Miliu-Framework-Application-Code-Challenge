import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';

import { GoalPage } from './goal.page';
import { SetGoalPage } from './set-goal/set-goal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxBootstrapSliderModule,
    RouterModule.forChild([{
        path: '',
        component: GoalPage
    }, {
            path: 'set',
            component: SetGoalPage
        }
    ])
  ],
    declarations: [GoalPage, SetGoalPage]
})
export class GoalPageModule {
}
