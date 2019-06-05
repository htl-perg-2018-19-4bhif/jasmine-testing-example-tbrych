import { Injectable } from '@angular/core';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

export interface InvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: number;
}

export interface InvoiceLineComplete extends InvoiceLine {
  priceExclusiveVat: number;
}

export interface Invoice {
  invoiceLines: InvoiceLineComplete[];
  totalPriceInclusiveVat: number;
  totalPriceExclusiveVat: number;
  totalVat: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculatorService {

  constructor(private vatCategoriesService: VatCategoriesService) { }

  public CalculatePriceExclusiveVat(priceInclusiveVat: number, vatPercentage: number): number {
    return (priceInclusiveVat * 100) / (100 + vatPercentage);
  }

  public CalculateInvoice(invoiceLines: InvoiceLine[]): Invoice {
    let lines: Invoice = { invoiceLines: undefined, totalPriceExclusiveVat: 0.0, totalPriceInclusiveVat: 0.0, totalVat: 0.0 };
    let exclVat: InvoiceLineComplete[] = [];

    invoiceLines.forEach(line => {
      let curPriceExclusiveVat: number = this.CalculatePriceExclusiveVat(line.priceInclusiveVat, this.vatCategoriesService.getVat(line.vatCategory));
      exclVat.push({ product: line.product, vatCategory: line.vatCategory, priceInclusiveVat: line.priceInclusiveVat, priceExclusiveVat: curPriceExclusiveVat });
      lines.totalPriceExclusiveVat += curPriceExclusiveVat;
      lines.totalPriceInclusiveVat += line.priceInclusiveVat;
    });
    lines.totalVat = lines.totalPriceInclusiveVat - lines.totalPriceExclusiveVat;
    lines.invoiceLines = exclVat;

    return lines;
  }
}
