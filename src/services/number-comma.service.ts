import { Injectable } from '@angular/core';

@Injectable()

export class NumberCommaService {
    constructor() { }

    execute(x) {  
        var parts = String(x).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

}