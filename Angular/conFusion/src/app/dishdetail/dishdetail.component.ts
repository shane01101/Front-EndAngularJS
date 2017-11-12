import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSliderModule } from '@angular/material/typings/slider';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';


@Component({
	selector: 'app-dishdetail',
	templateUrl: './dishdetail.component.html',
	styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
	dish: Dish;
	dishcopy = null;
	dishIds: number[];
	prev: number;
	next: number;
	errMess: string;
	commentForm: FormGroup;
	comment: Comment;
	rating: Number;

	formErrors = {
		'author': '',
		'comment': ''
	  };

	validationMessages = {
		'author': {
			'required':      'Author name is required.',
			'minlength':     'Author Name must be at least 2 chars long.'
		},
		'comment': {
			'required':      'Comment is required.'
		}
	};

	constructor(private dishservice: DishService,
		private route: ActivatedRoute,
		private location: Location,
		private fb: FormBuilder, 
		@Inject('BaseURL') private BaseURL) {}

	ngOnInit() {
		this.createForm();

		this.dishservice.getDishIds()
			.subscribe(dishIds => this.dishIds = dishIds);

		this.route.params
			.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
			.subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)},
			errmess => this.errMess = <any>errmess);

		this.route.params
			.switchMap((params: Params) => { return this.dishservice.getDish(+params['id']); })
			.subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
				errmess => { this.dish = null; this.errMess = <any>errmess; });
	}

	createForm() {
		this.commentForm = this.fb.group({
			rating: 5,
			comment: ['', Validators.required],
			author: ['', [Validators.required, Validators.minLength(2)]],
		});

		this.commentForm.valueChanges
			.subscribe(data => this.onValueChanged(data));

		this.onValueChanged(); // (re)set validation messages now
	}

	onValueChanged(data?: any) {
		if (!this.commentForm) { return; }
		const form = this.commentForm;
		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
			const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}
	

	onSubmit() {
		this.comment = this.commentForm.value;
		this.comment.date = new Date().toISOString();
		console.log(this.comment);
		this.dishcopy.comments.push(this.comment);
		this.dishcopy.save()
			.subscribe(dish => { this.dish = dish; console.log(this.dish); });
		this.commentForm.reset({
			rating: 5,
			comment: '',
			author: '',
		});
	}

	setPrevNext(dishId: number) {
		let index = this.dishIds.indexOf(dishId);
		this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
		this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
	}
	
	goBack(): void {
		this.location.back();
	}

}
