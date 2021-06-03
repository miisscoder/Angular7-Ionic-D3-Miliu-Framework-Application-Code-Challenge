import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
    selector: 'app-bar-chart',
    templateUrl: 'bar-chart.page.html',
    styleUrls: ['bar-chart.page.scss'],
})
export class BarChartPage implements OnInit, OnChanges {

    @Input() diaryData = [];
    width = 0;
    height = 0;
    chartData = [];



    color = [{
        'category': 'Rent & Utilities',
        'color': '#08a5e1'
    }, {
        'category': 'Travel',
        'color': '#ffa700'
    }, {
        'category': 'Food',
        'color': '#ff5a5a'
    }, {
        'category': 'Shopping',
        'color': '#bc43d3'
    }, {
        'category': 'Tax',
        'color': '#47c684'
    }, {
        'category': 'Income',
        'color': '#08a5e1'
    }, {
        'category': 'Other Income',
        'color': '#ffa700'
    }];

    rem = 0;

    constructor() {
    }

    ngOnInit() {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;
        this.rem = document.documentElement.clientWidth / 10.8;
        this.dealWithData();
        this.drawChart();

    }

    ngOnChanges() {
        this.rem = document.documentElement.clientWidth / 10.8;
        this.dealWithData();
        this.drawChart();
    }


    dealWithData() {
        const __ = this;
        this.chartData = [];
        const categories = _.map(this.color, 'category');
        _.each(this.diaryData, (o, i) => {
            let start = 0;
            let detail = [];

            for (let ii = 0; ii < categories.length; ii++) {
                const oo = _.find(o['details'],
                    (item) => item['category'] === categories[ii]);
                if (oo && oo['amount'] !== 0) {
                    detail.push({
                        'date': o['date'],
                        'category': oo['category'],
                        'amount': oo['amount'],
                        'start': start,
                        'end': start + oo['amount'],
                        'position': 'middle'
                    });
                    start += oo['amount'];
                }
            }
            if (detail.length > 0) {
                detail[0]['position'] = 'bottom';
                detail[detail.length - 1]['position'] = 'top';
            }
            this.chartData.push(detail);
        });
    }

    drawChart() {
        const __ = this;
        const widthC = this.width;
        const heightOffset = this.rem * 6.59;
        const heightC = this.height - heightOffset - this.rem * 2.3;
        if (heightC < 0 || widthC < 0) {
            return;
        }
        const margin = ({ top: 40, right: 16, bottom: 80, left: 16 });
        const textSize = 12;
        const textPaddiing = 24;
        let sums = [];
        _.each(this.diaryData, o => {
            sums.push(_.sumBy(o.details, 'amount'));
        });

        sums = this.diaryData.map(d => _.sumBy(d.details, 'amount'));
        const average = _.sum(sums) / sums.length;
        const x = d3.scaleBand()
            .domain(this.diaryData.map(d => d.date))
            .range([margin.left,
            widthC - margin.right])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([d3.max(sums), 0])
            .range([margin.top, heightC - margin.bottom]);

        const xAxis = g => g
            .attr('transform', `translate(0,${heightC - margin.bottom
                + textSize + textPaddiing})`)
            .call(d3.axisBottom(x).tickSizeOuter(0).tickSize(0).tickPadding(20))
            .call(g => g.select('.domain').remove());


        const yAxis = g => g
            .attr('transform', `translate(${margin.left * 5},${margin.top})`)
            .call(d3.axisLeft(y).tickSizeOuter(0).tickSize(10).tickPadding(15))
            .call(g => g.select('.domain').remove());

        d3.select('#barChart svg')
            .remove();
        const svg = d3.select('#barChart')
            .append('svg')
            .attr('viewBox', [0, 0, widthC, heightC]);

        const group = svg
            .selectAll('g')
            .data(this.chartData)
            .join('g');

        group.
            selectAll('path')
            .data(d => d)
            .join('path')
            .attr('fill', d => {
                const f = _.find(this.color,
                    o => o['category'] === d['category']);
                return f['color'];
            })
            .attr('d', d => {
                if (d.position === 'middle') {
                    return 'M' + x(d.date) + ' ' + (y(d.end) + margin.top) + ' ' +
                        'V ' + (margin.top + y(d.start)) + ' ' +
                        'h' + ' ' + x.bandwidth() + ' ' +
                        'V' + ' ' + (margin.top + y(d.end)) + ' ' +
                        'h' + ' ' + (- x.bandwidth()) + ' ' +
                        'Z';
                } else if (d.position === 'top') {
                    return 'M' + (x(d.date) + 5) + ' ' + (y(d.end) + margin.top) + ' ' +
                        'Q ' + x(d.date) + ' ' + (y(d.end) + margin.top) + ' ' +
                        x(d.date) + ' ' + (y(d.end) + margin.top + 5) + ' ' +
                        'V ' + (margin.top + y(d.start)) + ' ' +
                        'h ' + x.bandwidth() + ' ' +
                        'V ' + (margin.top + y(d.end) + 5) + ' ' +
                        'Q ' + (x(d.date) + x.bandwidth()) + ' ' + (y(d.end) + margin.top) + ' ' +
                        (x(d.date) + x.bandwidth() - 5) + ' ' + (y(d.end) + margin.top) + ' ' +
                        'Z';
                } else if (d.position === 'bottom') {
                    return 'M' + x(d.date) + ' ' + (y(d.end) + margin.top) + ' ' +
                        'V ' + (margin.top + y(d.start) - 5) + ' ' +
                        'Q ' + x(d.date) + ' ' + (y(d.start) + margin.top) + ' ' +
                        (x(d.date) + 5) + ' ' + (y(d.start) + margin.top) + ' ' +
                        'h ' + (x.bandwidth() - 10) + ' ' +
                        'Q ' + (x(d.date) + x.bandwidth()) + ' ' + (y(d.start) + margin.top) + ' ' +
                        (x(d.date) + x.bandwidth()) + ' ' + (y(d.start) + margin.top - 5) + ' ' +
                        'V ' + (y(d.end) + margin.top) + ' ' +
                        'Z';
                } else {
                    return 'M' + (x(d.date) + 5) + ' ' + (margin.top + y(d.end)) + ' ' +
                        'Q ' + x(d.date) + ' ' + (margin.top + y(d.end)) + ' ' +
                        x(d.date) + ' ' + (margin.top + y(d.end) + 5) + ' ' +
                        'V ' + (margin.top + y(d.start) - 5) + ' ' +
                        'Q ' + x(d.date) + ' ' + (margin.top + y(d.start)) + ' ' +
                        (x(d.date) + 5) + ' ' + (margin.top + y(d.start)) + ' ' +
                        'h ' + (x.bandwidth() - 10) + ' ' +
                        'Q ' + (x(d.date) + x.bandwidth()) + ' ' + (margin.top + y(d.start)) + ' ' +
                        (x(d.date) + x.bandwidth()) + ' ' + (margin.top + y(d.start) - 5) + ' ' +
                        'V ' + (margin.top + y(d.end) + 5) + ' ' +
                        'Q ' + (x(d.date) + x.bandwidth()) + ' ' + (margin.top + y(d.end)) + ' ' +
                        (x(d.date) + x.bandwidth() - 5) + ' ' + (margin.top + y(d.end)) + ' ' +
                        'Z';
                }
            });

        group
            .append('text')
            .text(d => '$' + _.sumBy(d, 'amount'))
            .attr('text-anchor', 'middle')
            .attr('x', d => d.length > 0 ? x(d[0].date) + x.bandwidth() / 2 : -200)
            .attr('y', d => y(_.sumBy(d, 'amount')) + margin.top - 5);

        if (y(average) + margin.top) {
            // average
            svg.append('path')
                .attr('d', d => 'M ' + margin.left + ' '
                    + (y(average) + margin.top)
                    + ' ' + (widthC - 16) + ' '
                    + (y(average) + margin.top))
                .attr('stroke-dasharray', '10,5')
                .attr('stroke', '#cccccc');

            svg.append('text')
                .text('Avg.$' + Math.floor(average))
                .attr('x', widthC - 16)
                .attr('y', y(sums[sums.length - 1]) >= y(average) &&
                    y(sums[sums.length - 1]) <= y(average) + 12 ?
                    y(average) + margin.top + 12 :
                    y(average) + margin.top - 12)
                .attr('text-anchor', 'end');
        }

        svg.append('g')
            .call(xAxis);


    }

}
