import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PromotionService {

	constructor(private restangular: Restangular,
		private processHTTPMsg: ProcessHTTPMsgService) { }

	getPromotions(): Observable<Promotion[]> {
		return this.restangular.all('promotions').getList();
	}

	getPromotion(id: number): Observable<Promotion> {
		return  this.restangular.one('promotions',id).get();
	}

	getFeaturedPromotion(): Observable<Promotion> {
		return this.restangular.all('promotions').getList({featured: true})
			.map(promotions => promotions[0]);
	}
}