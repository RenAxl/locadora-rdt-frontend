import { of, throwError } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Pagination } from 'src/app/core/models/Pagination';
import { Position } from '../../models/Position';
import { PositionListComponent } from './position-list.component';
import { PositionService } from '../../services/position.service';

describe('PositionListComponent', () => {
  let component: PositionListComponent;
  let positionService: jasmine.SpyObj<PositionService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;

  beforeEach(() => {
    positionService = jasmine.createSpyObj<PositionService>('PositionService', [
      'list',
      'delete',
    ]);
    messageService = jasmine.createSpyObj<MessageService>('MessageService', [
      'add',
    ]);
    confirmationService = jasmine.createSpyObj<ConfirmationService>(
      'ConfirmationService',
      ['confirm'],
    );

    component = new PositionListComponent(
      positionService,
      messageService,
      confirmationService,
    );
    component.grid = {
      reset: jasmine.createSpy('reset'),
    } as unknown as Table;
  });

  it('should list positions and update total elements', () => {
    positionService.list.and.returnValue(
      of({
        content: [{ id: 1, name: 'Gerente' }],
        totalElements: 1,
      }),
    );

    component.list(2);

    expect(component.pagination.page).toBe(2);
    expect(positionService.list).toHaveBeenCalledWith(
      component.pagination,
      '',
    );
    expect(component.positions.length).toBe(1);
    expect(component.positions[0]).toEqual(jasmine.any(Position));
    expect(component.positions[0].name).toBe('Gerente');
    expect(component.totalElements).toBe(1);
  });

  it('should calculate page from lazy load event', () => {
    spyOn(component, 'list');

    component.changePage({ first: 20, rows: 10 } as LazyLoadEvent);

    expect(component.list).toHaveBeenCalledWith(2);
  });

  it('should update filter and list from first page when searching', () => {
    spyOn(component, 'list');

    component.searchPosition('supervisor');

    expect(component.filterName).toBe('supervisor');
    expect(component.list).toHaveBeenCalledWith();
  });

  it('should not ask confirmation when position has no id', () => {
    component.confirmDelete(new Position({ name: 'Sem id' }));

    expect(confirmationService.confirm).not.toHaveBeenCalled();
  });

  it('should delete position after confirmation', () => {
    positionService.delete.and.returnValue(of(undefined));
    confirmationService.confirm.and.callFake((options) => {
      options.accept?.();

      return confirmationService;
    });

    component.confirmDelete(new Position({ id: 3, name: 'Gerente' }));

    expect(confirmationService.confirm).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'Tem certeza que deseja excluir?',
      }),
    );
    expect(positionService.delete).toHaveBeenCalledWith(3);
    expect(component.grid.reset).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: 'Cargo excluído com sucesso!',
    });
  });

  it('should show backend error message when listing fails', () => {
    positionService.list.and.returnValue(
      throwError(() => ({ error: { message: 'Falha ao buscar cargos.' } })),
    );

    component.list();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Falha ao buscar cargos.',
    });
  });

  it('should show fallback error message when delete fails', () => {
    positionService.delete.and.returnValue(throwError(() => ({})));
    confirmationService.confirm.and.callFake((options) => {
      options.accept?.();

      return confirmationService;
    });

    component.confirmDelete(new Position({ id: 4, name: 'Atendente' }));

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Erro ao excluir cargo.',
    });
  });

  it('should use default pagination configuration', () => {
    expect(component.pagination).toEqual(jasmine.any(Pagination));
    expect(component.pagination.page).toBe(0);
    expect(component.pagination.linesPerPage).toBe(5);
    expect(component.pagination.direction).toBe('ASC');
    expect(component.pagination.orderBy).toBe('name');
  });
});
