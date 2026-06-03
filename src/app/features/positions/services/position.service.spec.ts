import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PositionService],
    });

    service = TestBed.inject(PositionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list positions with pagination and name filter params', () => {
    const pagination = new Pagination(2, 10, 'DESC', 'name');

    service.list(pagination, 'gerente').subscribe((response) => {
      expect(response.content.length).toBe(1);
      expect(response.totalElements).toBe(1);
      expect(response.content[0]).toEqual({ id: 1, name: 'Gerente' });
    });

    const req = httpMock.expectOne((request) => {
      return request.method === 'GET' && request.url === API.POSITIONS.ROOT;
    });

    expect(req.request.params.get('name')).toBe('gerente');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('linesPerPage')).toBe('10');
    expect(req.request.params.get('direction')).toBe('DESC');
    expect(req.request.params.get('orderBy')).toBe('name');

    req.flush({
      content: [{ id: 1, name: 'Gerente' }],
      totalElements: 1,
    });
  });

  it('should insert a position', () => {
    service.insert({ name: 'Motorista' }).subscribe((position) => {
      expect(position).toEqual({ id: 1, name: 'Motorista' });
    });

    const req = httpMock.expectOne(API.POSITIONS.ROOT);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Motorista' });

    req.flush({ id: 1, name: 'Motorista' });
  });

  it('should find a position by id', () => {
    service.findById(7).subscribe((position) => {
      expect(position.id).toBe(7);
      expect(position.name).toBe('Atendente');
    });

    const req = httpMock.expectOne(API.POSITIONS.BY_ID(7));

    expect(req.request.method).toBe('GET');

    req.flush({
      id: 7,
      name: 'Atendente',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: null,
      createdBy: 'admin',
      updatedBy: null,
    });
  });

  it('should update a position by id', () => {
    service.update(3, { name: 'Supervisor' }).subscribe((position) => {
      expect(position).toEqual({ id: 3, name: 'Supervisor' });
    });

    const req = httpMock.expectOne(API.POSITIONS.BY_ID(3));

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Supervisor' });

    req.flush({ id: 3, name: 'Supervisor' });
  });

  it('should delete a position by id', () => {
    service.delete(4).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(API.POSITIONS.BY_ID(4));

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
