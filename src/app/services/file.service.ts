import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import * as Excel from 'exceljs';
import { ExcelData } from '../models/excel-data';
import { QuestionMaterial } from '../models/question-material';
import { MappingsService } from './mappings.service';
import { Item } from '../models/item';
import { Section } from '../models/section';
import { Scoring } from '../models/scoring';
import { ScoreResult } from '../models/score-result';

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

  constructor(
    private settingsService: SettingsService,
    private mappingsService: MappingsService) {
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
    return await handle?.getFileHandle(fileName, { create: createIfNotExists });
  }

  private async getDirectoryHandle(handle: FileSystemDirectoryHandle | undefined, directoryName: string, createIfNotExists = false): Promise<FileSystemDirectoryHandle | undefined> {
    return await handle?.getDirectoryHandle(directoryName, { create: createIfNotExists });
  }

  async createCandidateFolderAndCopyInterviewFormFile(candidateName: string) {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, true);
    const fileData = await this.readFromFile(this.interviewFormFileHandle);
    await this.writeToFile(handle, fileData);
  }

  private async readFromFile(fileHandle: FileSystemFileHandle | undefined): Promise<File> {
    if (!fileHandle) {
      throw new Error('File handle is undefined');
    }

    return await fileHandle.getFile();
  }

  private async writeToFile(fileHandle: FileSystemFileHandle | undefined, data: any) {
    if (!fileHandle) {
      throw new Error('File handle is undefined');
    }

    const writableStream = await (fileHandle as any).createWritable();
    await writableStream.write(data);
    await writableStream.close();
  }

  async getExcelData(candidateName: string): Promise<ExcelData | undefined> {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    if (!fileData) {
      return undefined;
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.overview.worksheetName);

    const excelData: ExcelData = {
      candidateName: String(worksheet.getCell(this.mappingsService.mappings.overview.candidateNameCell).value),
      interviewerName: String(worksheet.getCell(this.mappingsService.mappings.overview.interviewerNameCell).value),
      date: new Date(String(worksheet.getCell(this.mappingsService.mappings.overview.dateCell).value)),
      relevantExperience: Number(worksheet.getCell(this.mappingsService.mappings.overview.relevantExperienceCell).value),
      communication: String(worksheet.getCell(this.mappingsService.mappings.overview.communicationCell).value),
      finalResultLevel: String(worksheet.getCell(this.mappingsService.mappings.overview.finalResultLevelCell).value),
      overallImpression: String(worksheet.getCell(this.mappingsService.mappings.overview.overallImpressionCell).value)
    };

    return excelData;
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

  private async getCandidateInterviewFormFileHandle(candidateName: string, createIfNotExists: boolean): Promise<FileSystemFileHandle | undefined> {
    const candidateDirectoryHandle = await this.getDirectoryHandle(this.outputDirectoryHandle, candidateName, createIfNotExists);
    const fileName = `${candidateName} - ${this.settingsService.interviewFormFileName}`;

    let handle: FileSystemFileHandle | undefined;

    try {
      handle = await candidateDirectoryHandle?.getFileHandle(fileName, { create: createIfNotExists });
    } catch {
      try {
        handle = await candidateDirectoryHandle?.getFileHandle(this.settingsService.interviewFormFileName, { create: createIfNotExists });
      } catch {
        handle = undefined;
      }
    } finally {
      return handle;
    }
  }

  async getTaskItems(candidateName: string, selectedTask: string | undefined): Promise<Item[]> {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    if (fileData) {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(fileData as any);
      const worksheet = workbook.getWorksheet(this.mappingsService.mappings.tasks.worksheetName);

      let rows: number[];
      switch (selectedTask) {
        case 'ASP.NET Core Code Review':
          rows = this.mappingsService.mappings.tasks.aspNetCoreCommentRows;
          break;
        case 'WPF Code Review':
          rows = this.mappingsService.mappings.tasks.wpfCommentRows;
          break;
        default:
          return [];
      }

      const items = rows.map(row => {
        const item = new Item();
        item.question = String(worksheet.getCell(`${this.mappingsService.mappings.tasks.questionColumn}${row}`).value);
        item.scoreCell = `${this.mappingsService.mappings.tasks.scoreColumn}${row}`;
        item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
        return item;
      });

      return items;
    }

    return [];
  }

  async getSections(candidateName: string): Promise<Section[]> {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    if (fileData) {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(fileData as any);
      const worksheet = workbook.getWorksheet(this.mappingsService.mappings.csQuestions.worksheetName);

      const csQuestions = this.mappingsService.mappings.csQuestions;
      const sections = this.mappingsService.mappings.csQuestions.sections.map(section => {
        const sectionData = new Section();
        sectionData.title = String(worksheet.getCell(`${csQuestions.questionColumn}${section.titleRow}`).value);
        sectionData.suddenDeathItems = section.suddenDeath?.rows?.map(row => {
          const item = new Item();
          item.question = String(worksheet.getCell(`${csQuestions.questionColumn}${row}`).value);
          item.answer = String(worksheet.getCell(`${csQuestions.answerColumn}${row}`).value);
          item.scoreCell = `${csQuestions.scoreColumn}${row}`;
          item.row = row;
          item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
          return item;
        });
        sectionData.mandatoryItems = section.mandatary?.rows?.map(row => {
          const item = new Item();
          item.question = String(worksheet.getCell(`${csQuestions.questionColumn}${row}`).value);
          item.answer = String(worksheet.getCell(`${csQuestions.answerColumn}${row}`).value);
          item.scoreCell = `${csQuestions.scoreColumn}${row}`;
          item.row = row;
          item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
          return item;
        });
        sectionData.juniorItems = section.junior.rows?.map(row => {
          const item = new Item();
          item.question = String(worksheet.getCell(`${csQuestions.questionColumn}${row}`).value);
          item.answer = String(worksheet.getCell(`${csQuestions.answerColumn}${row}`).value);
          item.scoreCell = `${csQuestions.scoreColumn}${row}`;
          item.row = row;
          item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
          return item;
        });
        sectionData.regularItems = section.regular.rows?.map(row => {
          const item = new Item();
          item.question = String(worksheet.getCell(`${csQuestions.questionColumn}${row}`).value);
          item.answer = String(worksheet.getCell(`${csQuestions.answerColumn}${row}`).value);
          item.scoreCell = `${csQuestions.scoreColumn}${row}`;
          item.row = row;
          item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
          return item;
        });
        sectionData.seniorItems = section.senior.rows?.map(row => {
          const item = new Item();
          item.question = String(worksheet.getCell(`${csQuestions.questionColumn}${row}`).value);
          item.answer = String(worksheet.getCell(`${csQuestions.answerColumn}${row}`).value);
          item.scoreCell = `${csQuestions.scoreColumn}${row}`;
          item.row = row;
          item.score = Number(worksheet.getCell(item.scoreCell).value) ?? undefined;
          return item;
        });
        sectionData.juniorScore = Number(worksheet.getCell(`${csQuestions.scoreColumn}${section.junior.scoreRow}`).value) ?? undefined;
        sectionData.regularScore = Number(worksheet.getCell(`${csQuestions.scoreColumn}${section.regular.scoreRow}`).value) ?? undefined;
        sectionData.seniorScore = Number(worksheet.getCell(`${csQuestions.scoreColumn}${section.senior.scoreRow}`).value) ?? undefined;
        return sectionData;
      });

      return sections;
    }

    return [];
  }

  async setCandidateName(candidateName: string) {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.overview.worksheetName);

    worksheet.getCell(this.mappingsService.mappings.overview.candidateNameCell).value = candidateName;

    this.writeToFile(handle, await workbook.xlsx.writeBuffer());
  }

  async setOverview(candidateName: string, overview: any) {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.overview.worksheetName);

    worksheet.getCell(this.mappingsService.mappings.overview.interviewerNameCell).value = overview.interviewerName;
    worksheet.getCell(this.mappingsService.mappings.overview.dateCell).value = overview.date?.toDateString();
    worksheet.getCell(this.mappingsService.mappings.overview.relevantExperienceCell).value = overview.relevantExperience;

    this.writeToFile(handle, await workbook.xlsx.writeBuffer());
  }

  async setResult(candidateName: string, result: any, scoring?: Scoring) {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.overview.worksheetName);

    worksheet.getCell(this.mappingsService.mappings.overview.communicationCell).value = result.communication;
    worksheet.getCell(this.mappingsService.mappings.overview.finalResultLevelCell).value = result.finalResultLevel;
    worksheet.getCell(this.mappingsService.mappings.overview.overallImpressionCell).value = result.overallImpression;

    if (scoring) {
      const finalResultLevel = result.finalResultLevel.toLowerCase();
      if (finalResultLevel === 'junior') {
        worksheet.getCell(this.mappingsService.mappings.overview.finalResultScoreCell).value = scoring.junior?.score;
      } else if (finalResultLevel === 'regular') {
        worksheet.getCell(this.mappingsService.mappings.overview.finalResultScoreCell).value = scoring.regular?.score;
      } else if (finalResultLevel === 'senior') {
        worksheet.getCell(this.mappingsService.mappings.overview.finalResultScoreCell).value = scoring.senior?.score;
      }
    }

    this.writeToFile(handle, await workbook.xlsx.writeBuffer());
  }

  async setTaskItems(candidateName: string, taskItems?: Item[]) {
    if (!taskItems) {
      throw new Error('Task items are not defined');
    }

    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.tasks.worksheetName);

    taskItems.forEach(item => {
      worksheet.getCell(item.scoreCell).value = item.score;
    });

    this.writeToFile(handle, await workbook.xlsx.writeBuffer());
  }

  async getTaskScores(candidateName: string): Promise<{ aspNetCoreScore: number, wpfScore: number }> {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.tasks.worksheetName);

    const aspNetCoreScore = Number(worksheet.getCell(`${this.mappingsService.mappings.tasks.scoreColumn}${this.mappingsService.mappings.tasks.aspNetScoreRow}`).result);
    const wpfScore = Number(worksheet.getCell(`${this.mappingsService.mappings.tasks.scoreColumn}${this.mappingsService.mappings.tasks.wpfScoreRow}`).result);
    return { aspNetCoreScore, wpfScore };
  }

  async setSections(candidateName: string, sections?: Section[]) {
    if (!sections) {
      throw new Error("Sections are not defined");
    }

    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.csQuestions.worksheetName);

    sections.forEach(section => {
      section.suddenDeathItems?.forEach(item => worksheet.getCell(item.scoreCell).value = item.score);
      section.mandatoryItems?.forEach(item => worksheet.getCell(item.scoreCell).value = item.score);
      section.juniorItems?.forEach(item => worksheet.getCell(item.scoreCell).value = item.score);
      section.regularItems?.forEach(item => worksheet.getCell(item.scoreCell).value = item.score);
      section.seniorItems?.forEach(item => worksheet.getCell(item.scoreCell).value = item.score);
    });

    this.writeToFile(handle, await workbook.xlsx.writeBuffer());
  }

  async getScoring(candidateName: string): Promise<Scoring> {
    const handle = await this.getCandidateInterviewFormFileHandle(candidateName, false);
    const fileData = await this.readFromFile(handle);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileData as any);
    const worksheet = workbook.getWorksheet(this.mappingsService.mappings.csQuestions.worksheetName);

    const scoring = new Scoring();
    scoring.junior = new ScoreResult();
    scoring.junior.score = Number(worksheet.getCell(this.mappingsService.mappings.csQuestions.juniorScoreCell).result);
    scoring.junior.result = String(worksheet.getCell(this.mappingsService.mappings.csQuestions.juniorResultCell).result);
    scoring.regular = new ScoreResult();
    scoring.regular.score = Number(worksheet.getCell(this.mappingsService.mappings.csQuestions.regularScoreCell).result);
    scoring.regular.result = String(worksheet.getCell(this.mappingsService.mappings.csQuestions.regularResultCell).result);
    scoring.senior = new ScoreResult();
    scoring.senior.score = Number(worksheet.getCell(this.mappingsService.mappings.csQuestions.seniorScoreCell).result);
    scoring.senior.result = String(worksheet.getCell(this.mappingsService.mappings.csQuestions.seniorResultCell).result);

    return scoring;
  }
}
