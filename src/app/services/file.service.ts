import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import * as Excel from 'exceljs';
import { ExcelData } from '../models/excel-data';
import { QuestionMaterial } from '../models/question-material';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  tiDirectoryHandle?: FileSystemDirectoryHandle;
  outputDirectoryHandle?: FileSystemDirectoryHandle;
  inputDirectoryHandle?: FileSystemDirectoryHandle;
  aspNetCoreCodeFileHandle?: FileSystemFileHandle;
  wpfCodeFileHandle?: FileSystemFileHandle;
  questionMaterialsFileHandle?: FileSystemFileHandle;
  interviewFormFileHandle?: FileSystemFileHandle;

  constructor(private settingsService: SettingsService,
    private snackBarService: SnackBarService) {
  }

  async initialize() {
    await this.getTiDirectoryHandle();
    this.outputDirectoryHandle = await this.getDirectoryHandle(this.tiDirectoryHandle, this.settingsService.outputDirectory, true);
    this.inputDirectoryHandle = await this.getDirectoryHandle(this.tiDirectoryHandle, this.settingsService.inputDirectory);
    this.aspNetCoreCodeFileHandle = await this.getFileHandle(this.inputDirectoryHandle, this.settingsService.aspNetCoreCodeFileName);
    this.wpfCodeFileHandle = await this.getFileHandle(this.inputDirectoryHandle, this.settingsService.wpfCodeFileName);
    this.questionMaterialsFileHandle = await this.getFileHandle(this.inputDirectoryHandle, this.settingsService.questionMaterialsFileName);
    this.interviewFormFileHandle = await this.getFileHandle(this.inputDirectoryHandle, this.settingsService.interviewFormFileName);
  }

  async verifyPermission(fileHandle: any, readWrite: boolean) {
    const options: any = {};

    if (readWrite) {
      options.mode = 'readwrite';
    }

    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }

    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }

    return false;
  }

  private async getTiDirectoryHandle() {
    this.tiDirectoryHandle = await (window as any).showDirectoryPicker({ startIn: 'documents' });
  }

  private async getSubDirectoryNames(handle: FileSystemDirectoryHandle | undefined): Promise<string[]> {
    const subDirectoryNames: string[] = [];

    if (handle) {
      for await (const [name, fileHandle] of (handle as any)) {
        if (fileHandle.kind === 'directory') {
          subDirectoryNames.push(name);
        }
      }
    }

    return subDirectoryNames;
  }

  async getCandidateNames(): Promise<string[]> {
    return await this.getSubDirectoryNames(this.outputDirectoryHandle);
  }

  private async getFileHandle(handle: FileSystemDirectoryHandle | undefined, fileName: string, createIfNotExists = false): Promise<FileSystemFileHandle | undefined> {
    if (handle) {
      try {
        return await handle.getFileHandle(fileName, { create: createIfNotExists });
      } catch (error) {
        console.log(error);
      }
    }
    return undefined;
  }

  private async getDirectoryHandle(handle: FileSystemDirectoryHandle | undefined, directoryName: string, createIfNotExists = false): Promise<FileSystemDirectoryHandle | undefined> {
    if (handle) {
      try {
        return await handle.getDirectoryHandle(directoryName, { create: createIfNotExists });
      } catch (error) {
        console.log(error);
      }
    }
    return undefined;
  }

  async createUpdateCandidateFolder(excelData: ExcelData) {
    const candidateDirectoryHandle = await this.getDirectoryHandle(this.outputDirectoryHandle, excelData.candidateName, true);
    const handle = await candidateDirectoryHandle?.getFileHandle(this.settingsService.interviewFormFileName, { create: true });
    let fileData = await this.readFromFile(this.interviewFormFileHandle);
    fileData = await this.updateExcel(fileData, excelData);
    await this.writeToFile(handle, fileData);
  }

  private async readFromFile(fileHandle: FileSystemFileHandle | undefined): Promise<any> {
    if (fileHandle) {
      return await fileHandle.getFile();
    }
    return undefined;
  }

  private async writeToFile(fileHandle: FileSystemFileHandle | undefined, data: any) {
    if (fileHandle && data) {
      const writableStream = await (fileHandle as any).createWritable();
      await writableStream.write(data);
      await writableStream.close();
    }
  }

  async updateExcel(fileData: any, excelData: ExcelData): Promise<any> {
    if (!fileData || !excelData) {
      return undefined;
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet('Overview');
    worksheet.getCell('B1').value = excelData.candidateName;
    worksheet.getCell('B2').value = excelData.interviewerName;
    worksheet.getCell('B3').value = excelData.date?.toDateString();
    worksheet.getCell('B8').value = excelData.relevantExperience;
    return await workbook.xlsx.writeBuffer();
  }

  private async readAsText(fileHandle: FileSystemFileHandle | undefined): Promise<string> {
    return (await this.readFromFile(fileHandle))?.text() ?? '';
  }

  async getAspNetCoreCode(): Promise<string> {
    return await this.readAsText(this.aspNetCoreCodeFileHandle);
  }

  async getWpfCode(): Promise<string> {
    return await this.readAsText(this.wpfCodeFileHandle);
  }

  async getQuestionMaterials(): Promise<QuestionMaterial[]> {
    const questionMaterials: QuestionMaterial[] = [];
    const questionMaterialsText = await this.readAsText(this.questionMaterialsFileHandle);
    const regex = /line (?<line>\d+?)\r\n\r\n(?<code>.*?)\r\n\r\n/gs;
    [...questionMaterialsText.matchAll(regex)].forEach((match) => {
      const qm = new QuestionMaterial();
      qm.line = Number(match.groups?.['line']);
      qm.code = match.groups?.['code'];
      questionMaterials.push(qm);
    });

    return questionMaterials;
  }

  async getCandidateData(candidateName: string): Promise<ExcelData> {
    const excelData = new ExcelData();
    excelData.candidateName = candidateName;
    const candidateDirectoryHandle = await this.getDirectoryHandle(this.outputDirectoryHandle, candidateName, false);
    const handle = await candidateDirectoryHandle?.getFileHandle(this.settingsService.interviewFormFileName, { create: false });
    const fileData = await this.readFromFile(handle);
    if (fileData) {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(fileData as any);
      const worksheet = workbook.getWorksheet('Overview');
      excelData.interviewerName = String(worksheet.getCell('B2').value);
      excelData.date = new Date(String(worksheet.getCell('B3').value));
      excelData.relevantExperience = Number(worksheet.getCell('B8').value);
    }

    return excelData;
  }
}
