import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  tiDirectoryHandle?: FileSystemDirectoryHandle;
  outputDirectoryHandle?: FileSystemDirectoryHandle;

  constructor(private settingsService: SettingsService) {
  }

  async verifyPermission(fileHandle: any, readWrite: boolean) {
    const options: any = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  async getDirectoryHandle() {
    this.tiDirectoryHandle = await (window as any).showDirectoryPicker({ startIn: 'documents' });
  }

  async getOutputDirectoryHandle(createIfNotExists = false) {
    try {
      this.outputDirectoryHandle = undefined;
      this.outputDirectoryHandle = await this.tiDirectoryHandle?.getDirectoryHandle(this.settingsService.outputDirectory, { create: createIfNotExists });
    } catch (error) {
      console.log(error);
    }
  }

  async getCandidateNames(): Promise<string[]> {
    const candidates: string[] = [];

    await this.getOutputDirectoryHandle();

    if (this.outputDirectoryHandle) {
      for await (const [name, fileHandle] of (this.outputDirectoryHandle as any)) {
        if (fileHandle.kind === 'directory') {
          candidates.push(name);
        }
      }
    }
    
    return candidates;
  }
}
