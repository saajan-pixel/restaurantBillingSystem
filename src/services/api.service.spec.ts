import { TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ItemList } from 'src/app/interface/interfaces';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  const mockItemList: ItemList[] = [
    {
      id: 1,
      name: 'Sriracha-Buffalo Cauliflower Bites',
      categoryId: 2,
      price: 5000,
      discountAmount: 0,
      qty: 1,
      img: 'https://www.eatingwell.com/thmb/nsvs9RaKL0hRgXvaMBGs7r8uMjE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/loaded-smashed-brussels-sprouts-4f5ab837d61d40c8a5bf27a398ca29eb.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
  });
  service = TestBed.inject(ApiService);
  httpTestingController = TestBed.inject(HttpTestingController);

  describe('getItemsList()', () => {
    it('it should return items list when getItemsList() is called', (done: DoneFn) => {
      service.getItemsList().subscribe((data) => {
        expect(data).toEqual(mockItemList);
        done();
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItemList)
      
    });
  });
});
