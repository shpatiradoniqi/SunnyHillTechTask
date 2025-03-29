import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
// Define Product model
export interface Product {
  id: number ;
  name: string;
  price: number;
  quantity: number;
  status: 'Active',  // Default to Active
  categoryId: 1
}


export interface ProductResponse {
  totalCount: number;
  items: Product[];
}


export interface Category {
  id: number;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7153/api/products';

  constructor(private http: HttpClient) { }

  // Get Authorization header with token
  private getAuthHeaders(): HttpHeaders {
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser).token : null;

    if (!token) {
      console.error("No token found! Redirecting to login.");
     
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }




 
  getPagedProducts(pageIndex: number, pageSize: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/paged?pageIndex=${pageIndex}&pageSize=${pageSize}`, { headers: this.getAuthHeaders() });
  }


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { headers: this.getAuthHeaders() });
  }



// Add a new product
  addProduct(newProduct: Product): Observable<Product> {
    const headers = this.getAuthHeaders(); // Use the same headers as getCategories()

    // Ensure 'Status' is included
    newProduct.status = newProduct.status || 'Active';

    console.log('Sending Product:', newProduct); // Debugging

    return this.http.post<Product>(`${this.apiUrl}`, newProduct, { headers });
  }

  // Fetch a product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Service to delete a product
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`, {
      headers: this.getAuthHeaders() // Ensure to pass the authorization headers
    });
  }

  // Service to update a product
  editProduct(id: number, updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct, {
      headers: this.getAuthHeaders() // Ensure to pass the authorization headers
    });
  }




}
