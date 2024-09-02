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

    if (this.productData.length > 0) {
      const product = this.productData[0];
      doc.text(`Product Name: ${product.name}`, 10, 30);
      doc.text(`Price: ${product.price}`, 10, 40);
      doc.text(`Quantity: ${this.productQuantity}`, 10, 50);

      const imageUrl = `https://cors-anywhere.herokuapp.com/${product.image}`;
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = imageUrl;

      image.onload = () => {
        doc.addImage(image, 'JPEG', 10, 100, 50, 50);
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
