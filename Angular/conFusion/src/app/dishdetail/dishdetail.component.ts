import { Component, OnInit, Input } from '@angular/core';

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
	dishIds: number[];
	prev: number;
	next: number;

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

	commentForm: FormGroup;
	comment: Comment;
	rating: Number;

	constructor(private dishservice: DishService,
		private route: ActivatedRoute,
		private location: Location,
		private fb: FormBuilder) { 
			this.createForm();
		}

	ngOnInit() {
		this.dishservice.getDishIds()
			.subscribe(dishIds => this.dishIds = dishIds);

		this.route.params
			.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
			.subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)});
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
		this.dish.comments.push(this.comment);
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
