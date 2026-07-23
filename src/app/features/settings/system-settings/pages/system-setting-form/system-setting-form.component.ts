import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SystemSetting } from '../../models/system-setting';
import { SystemSettingService } from '../../services/system-setting.service';

@Component({
  selector: 'app-system-setting-form',
  templateUrl: './system-setting-form.component.html',
  styleUrls: ['./system-setting-form.component.css'],
})
export class SystemSettingFormComponent implements OnInit {
  setting = new SystemSetting();
  loading = false;
  saving = false;

  constructor(
    private service: SystemSettingService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void { this.load(); }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.setting.address.state = this.setting.address.state.toUpperCase();
    this.service.update(this.setting).subscribe({
      next: (data) => {
        this.setting = new SystemSetting(data);
        this.saving = false;
        this.messageService.add({ severity: 'success', detail: 'Configurações atualizadas com sucesso!' });
      },
      error: () => { this.saving = false; },
    });
  }

  private load(): void {
    this.loading = true;
    this.service.findCurrent().subscribe({
      next: (data) => {
        this.setting = new SystemSetting(data);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
