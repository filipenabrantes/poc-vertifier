import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private API_KEY = process.env.API_KEY;

  private readonly categories = [
    'clothing',
    'clothing_accesories',
    'health_beauty',
    'home_garden',
    'gifts',
    'food_drinks',
    'electronics_it',
    'antiques',
    'art',
    'cars',
    'industrial',
    'sports',
    'digital',
    'education',
    'office_supplies',
    'jewelry',
    'toys',
    'books',
    'pets',
    'music_movies',
    'services',
    'travel',
    'erotics',
    'bookstore_graphic',
    'equipment_machines',
    'other',
  ];

  private optimizeProductNames(products: string[]): string[] {
    const optimizedProducts = products.map((product) =>
      product
        .replace(/[\/|]/g, '')
        .replace(/\bde\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    );

    return optimizedProducts.slice(0, 50);
  }

  async detectVertical(products: string[], attempt = 1) {
    if (attempt > 3) {
      return {
        vertical: 'unknown',
      };
    }

    const openai = new OpenAI({
      apiKey: this.API_KEY,
    });

    const optimizedProducts = this.optimizeProductNames(products);
    const categoriesList = this.categories.join(', ');
    const prompt = `Categorize the store exclusively into one of the following categories: ${categoriesList}. Based on this list of products: ${optimizedProducts.join(
      ', ',
    )}. Return the best-fitting category and the percentage of confidence in the categorization. Return this exactly this string format: vertical:category, confidence:X%`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in store categorization.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const rawContent = response.choices[0].message.content;
      const verticalIndex =
        rawContent.indexOf('vertical:') + 'vertical:'.length;
      const confidenceIndex =
        rawContent.indexOf('confidence:') + 'confidence:'.length;
      const vertical = rawContent
        .substring(verticalIndex, rawContent.indexOf(',', verticalIndex))
        .trim();
      const confidence = rawContent.substring(confidenceIndex).trim();

      if (!this.categories.includes(vertical)) {
        throw new Error('Invalid vertical detected.');
      }
      console.log({ vertical, confidence });
      return { vertical, confidence };
    } catch (error) {
      console.error(`Error detecting vertical (attempt ${attempt}):`, error);
      return this.detectVertical(products, attempt + 1);
    }
  }
}
