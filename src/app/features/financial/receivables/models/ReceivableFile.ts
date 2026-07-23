import { SafeUrl } from '@angular/platform-browser';

export class ReceivableFile {
  id?: number;
  name?: string;
  originalFileName?: string;
  contentType?: string;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
  receivableId?: number;
  previewUrl?: SafeUrl;
  previewError?: boolean;

  constructor(init?: Partial<ReceivableFile>) {
    Object.assign(this, init);

    if (init?.createdAt) {
      this.createdAt = new Date(init.createdAt);
    }

    if (init?.updatedAt) {
      this.updatedAt = new Date(init.updatedAt);
    }
  }

  get fileName(): string | undefined {
    return this.originalFileName || this.name;
  }
}
