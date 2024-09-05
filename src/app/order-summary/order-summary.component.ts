import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  productData: any[] = [];
  userDetails: any = {};
  productQuantity: number = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = window.history.state;
    this.productData = navigation.productData || [];
    this.userDetails = navigation.userDetails || {};
    this.productQuantity = navigation.productQuantity || 1;
  }

  downloadPdf() {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('Order Summary', 10, 10);
  doc.setFontSize(12);

  // Adding User Details
  doc.text('Shipping Details:', 10, 30);
  doc.text(`Name: ${this.userDetails.name}`, 10, 40);
  doc.text(`Email: ${this.userDetails.email}`, 10, 50);
  doc.text(`Contact: ${this.userDetails.contact}`, 10, 60);
  doc.text(`Address: ${this.userDetails.address}`, 10, 70);

  // Adding Product Details
  if (this.productData.length > 0) {
    const product = this.productData[0];
    doc.text('Product Details:', 10, 90);
    doc.text(`Product Name: ${product.name}`, 10, 100);
    doc.text(`Price: ${product.price}`, 10, 110);
    doc.text(`Quantity: ${this.productQuantity}`, 10, 120);

    // Fetching and adding the product image to the PDF
    const imageUrl = product.image;
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;

    image.onload = () => {
      doc.addImage(image, 'JPEG', 10, 130, 50, 50); // Adjust the position as needed
      doc.save('Order-Summary.pdf');
      setTimeout(() => {
        this.router.navigate(['/my-orders']);
      }, 2000);
    };

    image.onerror = () => {
      console.error('Failed to load image.');
      doc.save('Order-Summary.pdf');
      setTimeout(() => {
        this.router.navigate(['/my-orders']);
      }, 2000);
    };
  } else {
    doc.save('Order-Summary.pdf');
    setTimeout(() => {
      this.router.navigate(['/my-orders']);
    }, 2000);
  }
}

}
