import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApplicationService } from '../services/application.service';
import { MenuController } from '@ionic/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent  {
    public appPages = [
        {
            title: 'Money Management',
            url: '/home',
            icon: 'management'
        },{
            title: 'Fund My Purchase',
            url: '/fund',
            icon: 'fund'
        },{
            title: 'Notifications',
            url: '/notifications',
            icon: 'notifications'
        },{
            title: 'Talk to Miliu',
            url: '/talk',
            icon: 'talk'
        },{
            title: 'Settings',
            url: '/settings',
            icon: 'settings'
        },{
            title: 'Logout',
            url: '/start',
            icon: 'logout'
        }
    ];
    startPageShow = true;
    pp = {};
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private appService: ApplicationService,
        private menu: MenuController
    ) {
        this.initializeApp();
    }

    menuClose() {   
        this.menu.enable(false, 'side');
        this.menu.close('side');
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });


        this.appService.getApp().subscribe(data => {
            this.pp = data;
        });

        document.documentElement.style.fontSize =
            document.documentElement.clientWidth / 10.8 + 'px';
        
    }
}
