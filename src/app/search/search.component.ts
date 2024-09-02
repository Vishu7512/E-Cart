import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: product[] | undefined;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const query = params.get('query');
      if (query) {
        this.product.searchProduct(query).subscribe((result) => {
          this.searchResult = result;
        });
      }
    });
  }
}
