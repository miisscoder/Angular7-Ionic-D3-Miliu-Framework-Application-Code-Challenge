import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { MenuController } from '@ionic/angular';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    budgetLeft = '';

    width = 0;
    height = 0;

    startX = 0;
    startY = 0;

    cardHeight = 0;
    cardWidth = 0;
    cardBoxHeight = 0;
    cards = [{
        id: 0,
        text: 'My Budget',
        active: true,
        url: '/budget'
    }, {
        id: 1,
        text: 'My Goals',
        active: true,
        url: '/goal'
    }, {
        id: 2,
        text: 'My Dashboard',
        active: true,
        url: '/dashboard'
    }, {
        id: 3,
        text: 'My Advice',
        active: false,
        url: '/home'
    }, {
        id: 4,
        text: 'My Spend',
        active: false,
        url: '/home'
    }, {
        id: 5,
        text: 'My Growth',
        active: false,
        url: '/home'
    }, {
        id: 6,
        text: 'My Borrowings',
        active: false,
        url: '/home'
    }, {
        id: 7,
        text: 'My Protection',
        active: false,
        url: '/home'
    }];


    constructor(private appService: ApplicationService,
        private menu: MenuController,
        private router: Router) {

    }

    ngOnInit() {
        this.appService.getMoneyManagement().subscribe(data => {
            this.budgetLeft = this.numberWithCommas(data['budgetLeft']);
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.cardWidth = this.width / 3;
        this.cardHeight = this.cardWidth * 400 / 355;
        this.cardBoxHeight = this.height - this.width / 1080 * 540;
        this.initDrag();
    }

    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    }

    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }
    // card item draging started
    dragstarted() {
        d3.select(this).raise();
        const transform = d3.select(this).attr('transform');
        const x = Number(transform.substring(transform.indexOf('(') + 1, transform.indexOf(',')));
        const y = Number(transform.substring(transform.indexOf(',') + 1, transform.indexOf(')')));
        d3.select(this)
            .attr('data-xOffset', x - d3.event.x)
            .attr('data-yOffset', y - d3.event.y);
        d3.select(this).attr('data-original-transform', 'translate(' + x + ',' + y + ')');
    }

    // card item draging 
    dragged(d) {
        d3.select(this)
            .attr('transform',
                'translate(' + Math.floor(d3.event.x +
                    Number(d3.select(this).attr('data-xOffset'))) +
                ',' + Math.floor(d3.event.y +
                    Number(d3.select(this).attr('data-yOffset'))) + ')');
    }


    // card item draging ended
    dragended(d, globleThis) {
        const target = d3.event.sourceEvent.target;
        const transform = d3.select(target).attr('transform') ?
            d3.select(target).attr('transform') :
            d3.select(target.parentNode).attr('transform');
        const x = transform.substring(transform.indexOf('(') + 1,
            transform.indexOf(','));
        const y = transform.substring(transform.indexOf(',') + 1,
            transform.indexOf(')'));
        const ids = d3.select(target).attr('id') ?
            d3.select(target).attr('id') :
            d3.select(target.parentNode).attr('id');
        const i = Number(ids.substring(1));

        let closestI = i;
        let minDistance = 1000000;
        const original = d3.select('#g' + i).attr('data-original-transform');
        _.each(globleThis.cards, (o) => {
            let xo = 0;
            let yo = 0;
            if (o.id !== i) {
                const transformo = d3.select('#g' + o.id).attr('transform');
                xo = Number(transformo.substring(transformo.indexOf('(') + 1,
                    transformo.indexOf(',')));
                yo = Number(transformo.substring(transformo.indexOf(',') + 1,
                    transformo.indexOf(')')));
                
            } else {
                xo = Number(original.substring(original.indexOf('(') + 1,
                    original.indexOf(',')));
                yo = Number(original.substring(original.indexOf(',') + 1,
                    original.indexOf(')')));
            }

            const d = Math.pow(x - xo, 2)
                + Math.pow(y - yo, 2);
            if (minDistance > d) {
                minDistance = d;
                closestI = o.id;
            }
        });
        if (closestI !== i) {
            const aim = _.clone(d3.select('#g' + closestI).attr('transform'));
            d3.select('#g' + i).attr('transform', aim);
            d3.select('#g' + closestI).attr('transform', original);
        } else {
            d3.select('#g' + i).attr('transform', original);
        }
    }



    initDrag() {
        const __ = this;
        d3.select('#buttons').select('svg').remove();
        const svg = d3.select('#buttons')
            .append('svg')
            .attr('viewBox', [0, 0, this.width, this.cardBoxHeight]);
        const g = svg.selectAll('g')
            .data(this.cards)
            .join('g')
            .attr('id', (d, i) => 'g' + d.id)
            .attr('transform',
                (d, i) => 'translate(' + (i % 3) * this.cardWidth + ',' +
                    Math.floor(i / 3) * this.cardHeight + ')')
            .call(d3.drag()
                .on('start', this.dragstarted)
                .on('drag', this.dragged)
                .on('end', (d, i) => this.dragended(d, this))
            );

        g.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.cardWidth)
            .attr('height', this.cardHeight)
            .attr('fill', '#ffffff')
            .attr('stroke', '#e4e4e4')
            .on('click', (d, i) => {
                if (d.active) {
                    this.router.navigateByUrl(d.url);
                }
            });

        g.append('rect')
            .attr('x', this.cardWidth * 0.2)
            .attr('y', this.cardWidth * 0.2)
            .attr('width', this.cardWidth * 0.6)
            .attr('height', this.cardWidth * 0.6)
            .attr('fill', '#f8f8f8')
            .attr('rx', '5')
            .attr('ry', '5')
            .on('click', (d, i) => {
                if (d.active) {
                    this.router.navigateByUrl(d.url);
                }
            });

        g.append('image')
            .attr('x', (d, i) => this.cardWidth * 0.2
                + this.cardWidth * 0.6 * 0.2)
            .attr('y', (d, i) => this.cardWidth * 0.2
                + this.cardWidth * 0.6 * 0.2)
            .attr('width', this.cardWidth * 0.6 * 0.6)
            .attr('height', this.cardWidth * 0.6 * 0.6)
            .attr('opacity', d => d.active ? 1 : 0.4)
            .attr('xlink:href',
                d => 'assets/image/icon/' + this.getIconClass(d.text) + '.png')
            .on('click', (d, i) => {
                if (d.active) {
                    this.router.navigateByUrl(d.url);
                }
            });

        g.append('text')
            .attr('x', this.cardWidth * 0.5)
            .attr('y', this.cardWidth)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Quicksand-Bold')
            .attr('font-size', 0.42 + 'rem')
            .attr('opacity', d => d.active ? 1 : 0.4)
            .text(d => d.text)
            .on('click', (d, i) => {
                if (d.active) {
                    this.router.navigateByUrl(d.url);
                }
            });
    }

    numberWithCommas(x) {
        var parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
}
