import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: any | product[];
  productMessage: undefined | string;
  icon = faTrash;
  iconEdit = faEdit;
  
  // pagination
pageSize = 5; // Number of items per page
  currentPage = 1;
  paginatedData:any = [];
  totalPages = 0;
  totalPagesArray:number[] = [];

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.list();

    // pagination


  }

  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is deleted';

        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  list() {
    this.product.productList().subscribe((result) => {
      if (result) {
        this.productList = result;
        // pagination
        this.totalPages = Math.ceil(this.productList.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
    this.updatePaginatedData();

      }
    });
  }

  // pagination
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.productList.slice(startIndex, endIndex);
  }
}
