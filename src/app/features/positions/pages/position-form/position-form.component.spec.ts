import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { PositionFormComponent } from './position-form.component';
import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';

describe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let positionService: jasmine.SpyObj<PositionService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  function createComponent(positionId: string | null = null): void {
    route = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(positionId),
        },
      },
    } as unknown as ActivatedRoute;

    component = new PositionFormComponent(
      positionService,
      messageService,
      router,
      route,
    );
  }

  function createForm(invalid: boolean): NgForm {
    return {
      invalid,
      control: {
        markAllAsTouched: jasmine.createSpy('markAllAsTouched'),
      },
    } as unknown as NgForm;
  }

  beforeEach(() => {
    positionService = jasmine.createSpyObj<PositionService>('PositionService', [
      'findById',
      'insert',
      'update',
    ]);
    messageService = jasmine.createSpyObj<MessageService>('MessageService', [
      'add',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  it('should not load position when route has no position id', () => {
    createComponent();

    component.ngOnInit();

    expect(positionService.findById).not.toHaveBeenCalled();
  });

  it('should load position for edition when route has position id', () => {
    positionService.findById.and.returnValue(
      of({
        id: 5,
        name: 'Gerente',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: null,
        createdBy: 'admin',
        updatedBy: null,
      }),
    );
    createComponent('5');

    component.ngOnInit();

    expect(positionService.findById).toHaveBeenCalledWith('5');
    expect(component.position.id).toBe(5);
    expect(component.position.name).toBe('Gerente');
  });

  it('should mark invalid form as touched and stop save', () => {
    createComponent();
    const form = createForm(true);

    component.save(form);

    expect(form.control.markAllAsTouched).toHaveBeenCalled();
    expect(positionService.insert).not.toHaveBeenCalled();
    expect(positionService.update).not.toHaveBeenCalled();
  });

  it('should insert a valid new position and navigate to list', () => {
    positionService.insert.and.returnValue(of({ id: 1, name: 'Motorista' }));
    createComponent();
    component.position = new Position({ name: '  Motorista  ' });

    component.save(createForm(false));

    expect(positionService.insert).toHaveBeenCalledWith({ name: 'Motorista' });
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: 'Cargo cadastrado com sucesso!',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/positions']);
  });

  it('should update a valid existing position and navigate to list', () => {
    positionService.update.and.returnValue(of({ id: 2, name: 'Supervisor' }));
    createComponent();
    component.position = new Position({ id: 2, name: ' Supervisor ' });

    component.save(createForm(false));

    expect(positionService.update).toHaveBeenCalledWith(2, {
      name: 'Supervisor',
    });
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: 'Cargo atualizado com sucesso!',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/positions']);
  });

  it('should show backend error message on insert failure', () => {
    positionService.insert.and.returnValue(
      throwError(() => ({ error: { message: 'Nome já cadastrado.' } })),
    );
    createComponent();
    component.position = new Position({ name: 'Gerente' });

    component.save(createForm(false));

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Nome já cadastrado.',
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
