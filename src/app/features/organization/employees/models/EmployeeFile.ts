import { SafeUrl } from '@angular/platform-browser';

export class EmployeeFile {
  id?: number;
  name!: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  createdAt?: Date;

  previewUrl?: SafeUrl;
  isImage?: boolean;
  previewError?: boolean;

  constructor(init?: Partial<EmployeeFile>) {
    Object.assign(this, init);

    if (init?.createdAt) {
      this.createdAt = new Date(init.createdAt);
    }

    this.isImage =
      (!!this.contentType && this.contentType.startsWith('image/')) ||
      (!!this.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(this.fileName));

    this.previewError = false;
  }
}