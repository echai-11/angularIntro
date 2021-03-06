import { Component, OnInit, ViewChild } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  @ViewChild("fform") feedbackFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  feedbackForm: FormGroup;
  yourComment: Comment;

  formErrors = {
    author: "",
    rating: "",
    comment: "",
  };

  validationMessages = {
    author: {
      required: "Name is required.",
      minlength: "Name must be at least 2 characters long.",
      maxlength: "Name cannot be more than 25 characters long.",
    },
    rating: {
      required: "Rating is required.",
    },
    comment: {
      required: "Comment is required.",
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params["id"]))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      author: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      rating: [5, [Validators.required]],
      comment: ["", [Validators.required]],
      date: [""],
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged();
  }

  goBack(): void {
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev =
      this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next =
      this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.yourComment = this.feedbackForm.value;
    this.yourComment.date = new Date().toISOString();
    console.log(this.yourComment);
    this.dish.comments.push(this.yourComment);
    this.feedbackForm.reset({
      author: "",
      comment: "",
      rating: 5,
      date: "",
    });
    this.feedbackFormDirective.resetForm();
  }
}
