import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { MenuController } from '@ionic/angular';
import * as d3 from "d3";
import * as _ from "lodash";

@Component({
    selector: 'app-transaction',
    templateUrl: 'transaction.page.html',
    styleUrls: ['transaction.page.scss'],
})
export class TransactionPage implements OnInit {

    width = 0;
    height = 0;
    card = 0;
    data = {};

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1
    };


    spendActive = true;

    columns = [
        {
            title: 'category', prop: 'category', sort: true,
            sortDirectionS: 'asc', sortDirectionI: 'asc'
        },
        {
            title: 'percent', prop: 'percent', sort: false,
            sortDirectionS: 'asc', sortDirectionI: 'asc'
        },
        {
            title: 'amount', prop: 'amount', sort: true,
            sortDirectionS: 'asc', sortDirectionI: 'asc'
        }
    ];

    color = [{
        "category": "Rent & Utilities",
        "color": '#08a5e1'
    }, {
        "category": "Travel",
        "color": '#ffa700'
    }, {
        "category": "Food",
        "color": '#ff5a5a'
    }, {
        "category": "Shopping",
        "color": '#bc43d3'
    }, {
        "category": "Tax",
        "color": '#47c684'
    }, {
        "category": "Income",
        "color": '#08a5e1'
    }, {
        "category": "Other Income",
        "color": '#ffa700'
    }];

    slideHeight = 0;
    slideShow = false;
    @ViewChild('sliding', { read: ElementRef }) sliding: ElementRef;

    slideData = {};

    constructor(private appService: ApplicationService,
        private menu: MenuController) {
    }

    ngOnInit() {
        this.appService.getTransactions().subscribe(data => {
            this.data = data;
            this.drawChart('spend');
        });

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.card = this.width / (this.width + 16 * 2);

    }

    drawChart(type) {
        const __ = this;
        const widthC = (this.width - 16 * 2) * 0.225;
        const heightC = widthC;
        const radius = (this.width - 16 * 2) * 0.225 / 2;
        const arc = d3.arc().innerRadius(radius * 0.75).outerRadius(radius);
        const pie = d3.pie()
            .sort(null)
            .value(d => d.percent);

        const arcs = type === 'spend' ? pie(this.data['spend']) : pie(this.data['income']);

        d3.select('#chart').select('svg').remove();
        const svg = d3.select('#chart')
            .append("svg")
            .attr('width', widthC)
            .attr('height', heightC)
            .attr("viewBox", [0, 0, widthC, heightC]);

        const g = svg.append("g")
            .attr("transform", `translate(${widthC / 2},${heightC / 2})`);

        g.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => {
                const f = _.find(this.color, o => o['category'] === d.data['category']);
                return f['color'];
            })
            .attr("d", arc);

        g.append('image')
            .attr('xlink:href',
                type === 'spend' ?
                    'assets/image/icon/my-spend.png' :
                    'assets/image/icon/money-black-m.png')
            .attr('x', '-0.75em')
            .attr('y', '-0.75em')
            .attr('width', '1.5em')
            .attr('height', '1.5em');
    }

    onClickCard(type) {
        this.spendActive = type === 'spend';
        this.drawChart(type);
    }

    getIconClass(item) {
        return item.toLocaleLowerCase().replace(' ', '-');
    }

    getNumber(percentage) {
        const n = percentage.substring(0, percentage.length - 1);
        return Number(n);
    }


    numberWithCommas(x) {
        var parts = String(x).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    menuOpen() {
        this.menu.enable(true, 'side');
        this.menu.open('side');
    }

    getLowerCase(type) {
        if (type) {
            const result = type.toLocaleLowerCase().replace(' & ', '-');
            return result.toLowerCase().replace(' ', '-');
        }
    }

    onSort(title, type, sortable) {
        if (!sortable) {
            return;
        }
        let index = -1;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].title === title) {
                index = i;
                break;
            }
        }
        const s = _.sortBy(this.data[type], [title]);
        if (this.columns[index]['sortDirection' + type[0].toUpperCase()] === 'asc') {
            this.columns[index]['sortDirection' + type[0].toUpperCase()] = 'desc';
            this.data[type] = _.reverse(s);
        } else {
            this.columns[index]['sortDirection' + type[0].toUpperCase()] = 'asc';
            this.data[type] = _.clone(s);
        }

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

    onClickRow(item, type) {
        this.slideData = _.find(this.data[type],
            o => o['category'] === item);
        this.slideMenuShow();
    }
}
