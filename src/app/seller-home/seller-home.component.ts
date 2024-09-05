import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: product[] = [];
  productMessage: undefined | string;
  icon = faTrash;
  iconEdit = faEdit;
  
  // Pagination properties
  pageSize = 5; // Number of items per page
  currentPage = 1;
  paginatedData: product[] = [];
  totalPages = 0;
  totalPagesArray: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.list();
  }

  // Fetch product list and handle pagination
  list() {
    this.productService.productList().subscribe((result: product[]) => {
      if (result) {
        this.productList = result;
        this.totalPages = Math.ceil(this.productList.length / this.pageSize);
        this.totalPagesArray = Array(this.totalPages)
          .fill(0)
          .map((x, i) => i + 1);
        this.updatePaginatedData();
      }
    });
  }

  // Handle product deletion
  deleteProduct(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success m-2",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.productMessage = 'Product is deleted';
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your product has been deleted.",
            "success"
          );
          this.list(); // Refresh the product list after deletion
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your product is safe :)",
          "error"
        );
      }
    });

    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  // Update the displayed data based on the current page
  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.productList.slice(startIndex, endIndex);
  }

  // Change the current page and update the displayed data
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }
}
