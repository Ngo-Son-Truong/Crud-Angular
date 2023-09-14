import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Employees } from '../model/employees';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  employees: Employees[] = [];
  totalalllength: any;
  isEditing = false;
  selectedFile: File | null = null;
  searchString: string = '';
  myForm: FormGroup;
  page:number=1;
  newemployees: Employees = {
    id: 0,
    name: '',
    birthday: '',
    gender: '',
    phone: '',
    address: '',
    image: '',
  };
  


  constructor(private employeesService: DataService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      name: ['',[Validators.required, this.noWhiteSpacesValidator]],
      birthday: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  noWhiteSpacesValidator(control: FormControl) {
    if (control.value && control.value.trim() === '') {
      return { whitespace: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.employees = this.employeesService.getAll();
  }


  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  // ... các hàm khác

  edit(employees: Employees) {
    this.isEditing = true;
    this.newemployees = { ...employees };
  }

  resetform() {
    this.isEditing = false;
    this.newemployees = {
      id: 0,
      name: '',
      birthday: '',
      gender: '',
      phone: '',
      address: '',
      image: '',
    };
    this.myForm.reset()
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.value = '';
  }

  textItems: string[] = [
    './assets/1.jpg',
    './assets/2.jpg',
    './assets/3.jpg',
    './assets/4.jpg',
    './assets/5.jpg',
    './assets/6.jpg',
  ];

  add(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.newemployees.image = event.target.result;
        this.employeesService.add(this.newemployees);
        this.resetform()
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // random ảnh
      const randomIndex = Math.floor(Math.random() * this.textItems.length);
      const randomText = this.textItems[randomIndex];

      this.newemployees.image = randomText;

      this.employeesService.add(this.newemployees);
      this.resetform()
    }
  }

  update(employees: Employees): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.newemployees.image = event.target.result;
        this.employeesService.update(employees);
        this.resetform
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.employeesService.update(employees);
      this.resetform(); // Kết thúc chỉnh sửa
    }
  }

  delete(id: number): void {
    this.employeesService.delete(id);
  }

  search() {
    this.employees = this.employeesService.searchEmployees(this.searchString);
  }


  
  saveOrUpdate(employees: Employees): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        employees.image = event.target.result;
        if (employees.id) {
          // Nếu có ID, thì đây là một người đã tồn tại, cần cập nhật
          this.employeesService.update(employees);
        } else {
          // Nếu không có ID, thì đây là một người mới, cần thêm mới
          this.employeesService.add(employees);
        }
        this.resetform();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // Đoạn này giả sử bạn muốn sử dụng ngẫu nhiên ảnh hoặc dữ liệu khác nếu không có tập tin được chọn.
      const randomIndex = Math.floor(Math.random() * this.textItems.length);
      const randomText = this.textItems[randomIndex];
      employees.image = randomText;
  
      if (employees.id) {
        this.employeesService.update(employees);
      } else {
        this.employeesService.add(employees);
      }
      this.resetform();
    }
  }
}
