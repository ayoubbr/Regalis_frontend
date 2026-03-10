import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';

@Component({
    selector: 'app-modules',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './modules.component.html',
    styleUrl: './modules.component.css'
})
export class ModulesComponent implements OnInit {
    private moduleService = inject(ModuleService);

    modules: Module[] = [];
    filteredModules: Module[] = [];
    searchQuery: string = '';

    ngOnInit(): void {
        this.loadModules();
    }

    loadModules(): void {
        this.moduleService.getAll().subscribe({
            next: (data) => {
                this.modules = data.sort((a, b) => a.orderIndex - b.orderIndex);
                this.applyFilters();
            },
            error: (err) => console.error('Error fetching modules', err)
        });
    }

    onSearch(): void {
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredModules = this.modules.filter(mod =>
            mod.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            mod.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    onEdit(module: Module): void {
        this.currentModule = { ...module };
        this.isEditing = true;
        this.isModalOpen = true;
    }

    onDelete(id: number): void {
        if (confirm('Are you sure you want to delete this module?')) {
            this.moduleService.delete(id).subscribe({
                next: () => this.loadModules(),
                error: (err) => console.error('Error deleting module', err)
            });
        }
    }

    getModuleIcon(module: Module): string {
        if (module.name.toLowerCase().includes('opening')) return 'castle';
        if (module.name.toLowerCase().includes('tactic')) return 'military_tech';
        if (module.name.toLowerCase().includes('endgame')) return 'target';
        return 'category';
    }

    // Modal logic
    isModalOpen = false;
    isEditing = false;
    currentModule: any = {
        name: '',
        description: '',
        orderIndex: 0
    };

    openCreateModal(): void {
        this.resetForm();
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
    }

    resetForm(): void {
        this.isEditing = false;
        this.currentModule = {
            name: '',
            description: '',
            orderIndex: this.modules.length + 1
        };
    }

    saveModule(): void {
        if (!this.currentModule.name || !this.currentModule.description) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.isEditing) {
            this.moduleService.update(this.currentModule.id, this.currentModule).subscribe({
                next: () => {
                    this.loadModules();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating module', err)
            });
        } else {
            this.moduleService.create(this.currentModule).subscribe({
                next: () => {
                    this.loadModules();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating module', err)
            });
        }
    }
}
