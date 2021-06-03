import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'start',
        pathMatch: 'full'
    },
    {
        path: 'fund',
        loadChildren: './blank/blank.module#BlankPageModule'
    },
    {
        path: 'notifications',
        loadChildren: './blank/blank.module#BlankPageModule'
    },
    {
        path: 'talk',
        loadChildren: './blank/blank.module#BlankPageModule'
    },
    {
        path: 'settings',
        loadChildren: './blank/blank.module#BlankPageModule'
    },
    {
        path: 'start',
        loadChildren: './start/start.module#StartPageModule'
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
    },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardPageModule'
    },
    {
        path: 'budget',
        loadChildren: './budget/budget.module#BudgetPageModule'
    },
    {
        path: 'transaction',
        loadChildren: './transaction/transaction.module#TransactionPageModule'
    },
    {
        path: 'goal',
        loadChildren: './goal/goal.module#GoalPageModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
