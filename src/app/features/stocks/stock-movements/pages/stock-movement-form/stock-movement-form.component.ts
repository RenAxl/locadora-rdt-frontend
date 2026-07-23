import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';

import { ItemMapper } from '../../../items/mapper/item.mapper';
import { StockMovementMapper } from '../../mapper/stock-movement.mapper';
import { Item } from '../../../items/models/Item';
import { StockMovement } from '../../models/StockMovement';
import { ItemService } from '../../../items/services/item.service';
import { StockMovementService } from '../../services/stock-movement.service';

@Component({
  selector: 'app-stock-movement-form',
  templateUrl: './stock-movement-form.component.html',
  styleUrls: ['./stock-movement-form.component.css'],
})
export class StockMovementFormComponent implements OnInit {
  movement: StockMovement = new StockMovement();
  items: Item[] = [];
  movementTypes = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'EXIT', label: 'Saída' },
    { value: 'RESERVE', label: 'Reserva' },
    { value: 'RETURN', label: 'Devolução' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
  ];

  private subs: Subscription[] = [];

  constructor(
    private itemService: ItemService,
    private stockMovementService: StockMovementService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const dto = StockMovementMapper.toInsertDTO(this.movement);

    const sub = this.stockMovementService.insert(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Movimentação registrada com sucesso!',
        });

        this.router.navigate(['/items/stock-balances']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao registrar movimentação.',
        });
      },
    });

    this.subs.push(sub);
  }

  private loadItems(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    const sub = this.itemService.list(pagination, '').subscribe({
      next: (response) => {
        this.items = (response?.content ?? []).map(ItemMapper.fromDTO);
      },
      error: () => {
        this.items = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar os itens.',
        });
      },
    });

    this.subs.push(sub);
  }
}
