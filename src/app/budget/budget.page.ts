import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ApplicationService} from '../../services/application.service';
import { MenuController } from '@ionic/angular';
import {Location} from '@angular/common';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
    selector: 'app-budget',
    templateUrl: 'budget.page.html',
    styleUrls: ['budget.page.scss'],
})
export class BudgetPage implements OnInit {
    
    width = 0;
    height = 0;
    
    data = {};

    slideOpts = {
        initialSlide: 2,
        speed: 400,
        slidesPerView: 2
    };

    slideHeight = 0;
    slideShow = false;
    @ViewChild('sliding', { read: ElementRef }) sliding: ElementRef;

    spendExpand = false;
    borrowingsExpand = false;
    protectionExpand = false;
    constructor(private appService: ApplicationService,
        private menu: MenuController,
        private _location: Location) {
    }

    ngOnInit() {
        this.appService.getBudget().subscribe(data => {
            this.data = data;
            this.onInitChart();
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    }

    onInitChart() {
        const heightC = 0.25 * this.height;
        const widthC = this.width - 16 - 16;
        const items = this.data['growth'].items;
        let ticks = [];
        _.forEach(items, function (o) {
            o['date'] = new Date(o['date']);
            ticks.push(o['date']);
        });
        const margin = ({ top: 20, right: 20, bottom: 20, left: 20 });
        const x = d3.scaleTime()
            .domain(d3.extent(items, d => d.date))
            .range([margin.left, widthC - margin.right]);

        const xAxis = g => g
            .attr('transform', `translate(0,${heightC - margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickValues(ticks)
                .tickFormat(d =>  (d.getMonth() + 1) + '/' + d.getDate())
                .tickSizeOuter(0)
                .tickSizeInner(0));

        const y = d3.scaleLinear()
            .domain([0, d3.max(items, d => d.percetage)]).nice()
            .range([heightC - margin.bottom, margin.top]);

        const line = d3.line()
            .curve(d3.curveCardinal)
            .x(d => x(d.date))
            .y(d => y(d.percetage));

        const svg = d3.select('#chart').append('svg')
            .attr('viewBox', [0, 0, widthC, heightC]);
        const linearGradient = svg.append('defs')
            .append('linearGradient')
            .attr('id','grad');  
        linearGradient.append('stop')
            .attr('stop-color', '#0ea3dc');
        linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#f25745');

        svg.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'url(#grad)')
            .attr('stroke-width', 1.5) 
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', line(items));

        const circle = svg.selectAll('circle').data(items).enter();

        circle.append('circle')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.percetage))
            .attr('r', '3px')
            .attr('fill', (d, i) => {
                const start = 0x0ea3dc;
                const end = 0xf25745;
                const gap = Math.floor((end - start) /
                    (items.length - 1));
                return '#' + (start + i * gap).toString(16);
            })
            .attr('opacity', '1');

        circle.append('text')
            .attr('x', d => x(d.date) - 10)
            .attr('y', d => 
                d.percetage < 90 ?
                y(d.percetage) - 10 :
                y(d.percetage) + 20)
            .text(d => d.percetage + '%')
            .attr('fill', (d, i) => {
                const start = 0x0ea3dc;
                const end = 0xf25745;
                const gap = Math.floor((end - start) /
                    (items.length - 1));
                return '#' + (start + i * gap).toString(16);
            });

        const tickG = svg.append('g')
            .call(xAxis);

        tickG.select('.domain').remove();
        tickG.select('text')
            .style('font-size', '1em');
    }


    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    } 
    getIconName(type) {
        if ('Rent & Utilities' === type) {
            return 'rent-utilities';
        } else {
            return this.getIconClass(type);
        }
    }
    getNumber(percentage) {
        const n = percentage.substring(0, percentage.length - 1);
        return Number(n);
    }

    getInteger(number) {
        return Math.floor(number);
    }

    numberWithCommas(x) {
        var parts = String(x).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }

    getLowerCase(type) {
        return type.toLowerCase().replace(' ', '-');
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

    onBack() {
        this._location.back();
    }
}
