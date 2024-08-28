import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  productData: any;
  userDetails: any;
  productQuantity: number = 1;

  ngOnInit(): void {
    // Assuming the productData and userDetails are passed via router state
    this.productData = history.state.productData;
    this.userDetails = history.state.userDetails;
  }

  downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Order Summary', 10, 10);
    doc.setFontSize(12);
    doc.text(`Product Name: ${this.productData?.name}`, 10, 30);
    doc.text(`Price: ${this.productData?.price}`, 10, 40);
    doc.text(`Quantity: ${this.productQuantity}`, 10, 50);
    doc.text(`User Name: ${this.userDetails?.name}`, 10, 60);
    doc.text(`Email: ${this.userDetails?.email}`, 10, 70);

    const image = new Image();
    image.src = this.productData?.image || '';
    image.onload = () => {
      doc.addImage(image, 'JPEG', 10, 80, 50, 50);
      doc.save('Order-Summary.pdf');
    };
  }
}
