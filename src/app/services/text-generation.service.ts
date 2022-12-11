import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class TextGenerationService {
  openai: any;

  constructor(private settingsService: SettingsService) {
  }

  initialize(apiKey: string) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateText(text: string): Promise<string> {
    this.initialize(this.settingsService.openAiApiKey);
    const response = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Improve the following text:\n" + text + "\n",
      temperature: 0,
      max_tokens: 256,
    });

    return response.data.choices[0].text;
  }
}
