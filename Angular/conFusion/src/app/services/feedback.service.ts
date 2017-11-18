import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Feedback } from '../shared/feedback';

@Injectable()
export class FeedbackService {

	constructor(private restangular: Restangular,
		private processHTTPMsg: ProcessHTTPMsgService) { }

	submitFeedback(feedback: Feedback) : Observable<Feedback> {
		return this.restangular.all('feedback').post(feedback);
  }
}