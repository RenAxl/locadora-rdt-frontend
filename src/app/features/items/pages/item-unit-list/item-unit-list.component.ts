import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ItemUnit } from '../../models/stock/ItemUnit';
import { ItemUnitService } from '../../services/stock/item-unit.service';

@Component({
  selector: 'app-item-unit-list',
  templateUrl: './item-unit-list.component.html',
  styleUrls: ['./item-unit-list.component.css'],
})
export class ItemUnitListComponent implements OnInit {
  units: ItemUnit[] = [];
  itemName: string = '';

  constructor(
    private route: ActivatedRoute,
    private itemUnitService: ItemUnitService,
  ) {}

  ngOnInit(): void {
    const itemId = Number(this.route.snapshot.paramMap.get('itemId'));
    this.itemUnitService.listByItem(itemId).subscribe((units) => {
      this.units = units;
      if (units.length > 0) {
        this.itemName = units[0].itemName;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      AVAILABLE: 'Disponível',
      RESERVED: 'Alugada',
      RENTED: 'Alugada',
      MAINTENANCE: 'Em manutenção',
    };
    return labels[status] || status;
  }

  getConditionLabel(condition: string): string {
    const labels: { [key: string]: string } = {
      NEW: 'Nova',
      GOOD: 'Boa',
      DAMAGED: 'Danificada',
    };
    return labels[condition] || condition;
  }
}
