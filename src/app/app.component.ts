import { Component } from '@angular/core';
import { InvoiceLine, InvoiceCalculatorService, Invoice } from './invoice-calculator.service';
import { VatCategory } from './vat-categories.service';

interface IResultInvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: string;
  priceExclusiveVat: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoiceLines: InvoiceLine[] = [];
  invoice: Invoice;

  resultInvoiceLines: IResultInvoiceLine[] = [];
  totalPriceInclusiveVat: string;
  totalPriceExclusiveVat: string;

  product = "";
  priceInclusiveVat = 0;
  vatCategoryString = "Food";

  vatCategories = VatCategory;

  constructor(private invoiceCalculator: InvoiceCalculatorService) { }

  addInvoice() {
    let category;
    if (this.vatCategoryString === "Drinks") {
      category = this.vatCategories.Drinks;
    } else {
      category = this.vatCategories.Food;
    }
    this.invoiceLines.push({ product: this.product, vatCategory: category, priceInclusiveVat: this.priceInclusiveVat });

    this.invoice = this.invoiceCalculator.CalculateInvoice(this.invoiceLines);
    this.resultInvoiceLines = [];

    this.invoice.invoiceLines.forEach(element => {
      let exclVat = parseFloat(Math.round(element.priceExclusiveVat * 100) / 100 + '').toFixed(2);
      let inclVat = parseFloat(Math.round(element.priceInclusiveVat * 100) / 100 + '').toFixed(2);
      this.resultInvoiceLines.push({ product: element.product, vatCategory: element.vatCategory, priceInclusiveVat: inclVat, priceExclusiveVat: exclVat });
    });

    this.totalPriceExclusiveVat = parseFloat(Math.round(this.invoice.totalPriceExclusiveVat * 100) / 100 + '').toFixed(2);
    this.totalPriceInclusiveVat = parseFloat(Math.round(this.invoice.totalPriceInclusiveVat * 100) / 100 + '').toFixed(2);
  }
}
