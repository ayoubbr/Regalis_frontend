import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.css'
})
export class AdventureComponent implements OnInit {
  modules: Module[] = [];
  roadPath: string = '';
  
  constructor(private moduleService: ModuleService) {}

  ngOnInit(): void {
    this.moduleService.getAll().subscribe(modules => {
      this.modules = modules.sort((a, b) => a.orderIndex - b.orderIndex);
    });
  }

  getNodeOffset(index: number): number {
    // Return a horizontal offset in pixels to create a wavy effect
    // Alternates: 0, 50, 80, 50, 0, -50, -80, -50...
    const offsets = [0, 45, 75, 45, 0, -45, -75, -45];
    return offsets[index % offsets.length];
  }

  getNodeIcon(index: number): string {
      if (index % 5 === 4) return 'trophy';
      if (index === 2) return 'star'; // Active node
      return 'lock';
  }
}
