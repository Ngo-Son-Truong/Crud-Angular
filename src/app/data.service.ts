import { Injectable } from '@angular/core';
import { Employees } from './model/employees';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private localStorageKey = 'people';
  private employees: Employees[] = [];
  
  constructor() {
    const storedPeople = localStorage.getItem(this.localStorageKey);
    if (storedPeople) {
      this.employees = JSON.parse(storedPeople);
    }
  }

 

  getAll(): Employees[] {
    return this.employees;
  }

  add(person: Employees): void {
    person.id = this.generateId();
    this.employees.push(person);
    this.saveToLocalStorage();
  }

  update(person: Employees): void {
    const index = this.employees.findIndex((p) => p.id === person.id);
    if (index !== -1) {
      this.employees[index] = person;
      this.saveToLocalStorage();
    }
  }

  delete(id: number): void {
    const index = this.employees.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  private generateId(): number {
    const maxId = this.employees.reduce((max, p) => (p.id > max ? p.id : max), 0);
    return maxId + 1;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.employees));
  }

  searchEmployees(searchTerm: string) {
    if (searchTerm.trim() === '') {
      return this.employees;
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      return this.employees.filter(employees => {
        return (
          employees.name.toLowerCase().includes(searchTermLower) ||
          employees.birthday.toLowerCase().includes(searchTermLower) ||
          employees.phone.toString().toLowerCase().includes(searchTermLower) ||
          employees.gender.toLowerCase().includes(searchTermLower) ||
          employees.address.toLowerCase().includes(searchTermLower)
        );
      });
    }
  }

}
