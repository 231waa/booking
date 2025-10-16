import { StickyDirective } from '@/app/directives/sticky.directive'
import { currency } from '@/app/store'
import { CommonModule } from '@angular/common'
import { Component, HostListener } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'detail-price-overview',
  standalone: true,
  imports: [RouterModule, StickyDirective, CommonModule],
  templateUrl: './price-overview.component.html',
  styles: `
    :host(detail-price-overview) {
      display: contents !important;
    }
  `,
})
export class PriceOverviewComponent {
  currencyType = currency
  classFlag = true
  isSticky = window.innerWidth >= 1200
}
