import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product, ProductService, ProductResponse, Category } from '../../services/product.service';  // Import the ProductService
import { BehaviorSubject, Observable } from 'rxjs'; // Import Observable
import { of } from 'rxjs';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  
  products: Product[] = [];
  categories: Category[] = [];
 
  currentPage: number = 1;
  totalPages: number = 1;
  isAdmin: boolean = false;
  newProduct: Product = { id: 0, name: '', price: 0, quantity: 0, status: 'Active', categoryId: 1 };

  @ViewChild('addProductDialog') addProductDialog: TemplateRef<any> | undefined;
  constructor(private modalService: NgbModal, private productService: ProductService, private router: Router) { }
  
  openAddProductDialog(modal: any): void {
    // Initialize an empty product object for the "Add Product" modal
    this.newProduct = { id: 0, name: '', price: 0, quantity: 0, status: 'Active', categoryId: 1 };
    this.modalService.open(modal); // Open the modal for adding a product
  }


  ngOnInit(): void {
    this.loadProducts();
    this.checkUserRole();
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  //loadProducts(): void {
  //  this.products$ = this.productService.loadProducts(this.currentPage); // Assign to Observable
  //}
  
  loadProducts(): void {
    this.productService.getPagedProducts(this.currentPage, 5).subscribe(
      (response: ProductResponse) => {
        console.log('API Response:', response);

        if (response && response.items) { // Correct key (was response.data)
          this.products = response.items; //  Use response.items instead of response.data
          this.totalPages = Math.ceil(response.totalCount / 5); //  Calculate pages
          this.currentPage = this.currentPage;
        } else {
          console.warn('Response does not contain expected data:', response);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }




  
  trackById(index: number, product: Product): number {
    return product.id;
  }

  checkUserRole(): void {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      this.isAdmin = true;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
  // Add product method (update as needed)
  addProduct(modal:any): void {
    console.log('Product being added:', this.newProduct);
    this.productService.addProduct(this.newProduct).subscribe(
      () => {
        console.log(this.newProduct);
        this.loadProducts();
        modal.close(); 
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }


 
  // Pre-fill the newProduct with data for editing
  editProduct(productId: number, modal: any): void {
    // Fetch the full product by its ID
    this.productService.getProductById(productId).subscribe(
      (product) => {
        this.newProduct = { ...product };  // Populate the newProduct with the fetched product
        // Open the modal after the product is fetched
        this.modalService.open(modal); // Open the modal dialog
      
      },
      (error) => {
        console.error('Error fetching product:', error);
       
      }
    );
  }


  // Update a product
  updateProduct(modal:any): void {
    if (!this.newProduct.id || this.newProduct.id === 0) {
      console.error('Invalid product ID:', this.newProduct.id);
      return;
    }

    if (!this.newProduct.categoryId) {
      console.error('Category is required.');
      return;
    }

    console.log('Updating product with ID:', this.newProduct.id, this.newProduct);

    this.productService.editProduct(this.newProduct.id, this.newProduct).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts();
        modal.close(); 
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }




  // Delete a product
  deleteProduct(product: Product): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(product.id).subscribe(
        () => {
          console.log('Product deleted');
          this.loadProducts(); // Reload the product list after deletion
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  // Load a product by ID
  loadProductById(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.newProduct = { ...product }; // Set the full product object
      },
      (error) => {
        console.error('Error fetching product by ID:', error);
      }
    );
  }




  logout(): void {
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
