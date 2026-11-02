import { describe, it, expect } from 'vitest';
import {
  STORY_CHAPTERS,
  CORE_CHARACTERS,
  RECURRING_CUSTOMERS,
  RANG_BOOK_PAGES,
  getChapter,
  getScene,
  getRangBookPage,
  getCustomerById,
  getNextStoryScene,
} from '../../src/game/story';

describe('Story & Character System (Phase 1)', () => {
  it('has all 6 core characters with original wholesome profiles', () => {
    expect(CORE_CHARACTERS.anaya).toBeDefined();
    expect(CORE_CHARACTERS.zoya).toBeDefined();
    expect(CORE_CHARACTERS.kabir).toBeDefined();
    expect(CORE_CHARACTERS.tara).toBeDefined();
    expect(CORE_CHARACTERS.kajal).toBeDefined();
    expect(CORE_CHARACTERS.rhea).toBeDefined();

    expect(CORE_CHARACTERS.anaya.name).toBe('Anaya Sharma');
    expect(CORE_CHARACTERS.zoya.name).toBe('Zoya Akhtar');
    expect(CORE_CHARACTERS.kabir.name).toBe('Kabir Sen');
  });

  it('has exactly 12 diverse recurring customers with quirks and catchphrases', () => {
    expect(RECURRING_CUSTOMERS).toHaveLength(12);

    const ids = new Set(RECURRING_CUSTOMERS.map(c => c.id));
    expect(ids.size).toBe(12);

    RECURRING_CUSTOMERS.forEach(customer => {
      expect(customer.name.length).toBeGreaterThan(0);
      expect(customer.quirk.length).toBeGreaterThan(0);
      expect(customer.catchphrase.length).toBeGreaterThan(0);
      expect(customer.preferredShades.length).toBeGreaterThanOrEqual(1);
      expect(['fair', 'wheatish', 'medium', 'tan', 'deep', 'dark']).toContain(customer.skinTone);
    });
  });

  it('has all 7 secret Rang Book signature looks', () => {
    expect(RANG_BOOK_PAGES).toHaveLength(7);
    for (let i = 1; i <= 7; i++) {
      const page = getRangBookPage(i);
      expect(page).toBeDefined();
      expect(page?.title.length).toBeGreaterThan(0);
      expect(page?.lore.length).toBeGreaterThan(0);
      expect(page?.keyShades.length).toBeGreaterThanOrEqual(2);
      expect(page?.recipePreview.eyes.length).toBeGreaterThan(0);
      expect(page?.recipePreview.cheeks.length).toBeGreaterThan(0);
      expect(page?.recipePreview.lips.length).toBeGreaterThan(0);
    }
  });

  it('has 4 chapters with 12 scenes each (48 total scenes)', () => {
    expect(STORY_CHAPTERS).toHaveLength(4);

    let totalScenes = 0;
    STORY_CHAPTERS.forEach(chapter => {
      expect(chapter.scenes).toHaveLength(12);
      chapter.scenes.forEach(scene => {
        totalScenes++;
        expect(scene.chapterId).toBe(chapter.id);
        expect(scene.cards.length).toBeGreaterThanOrEqual(1);
        expect(scene.cards.length).toBeLessThanOrEqual(4);

        // Every card has a valid speaker, text, and expression
        scene.cards.forEach(card => {
          expect(card.speaker.length).toBeGreaterThan(0);
          expect(card.text.length).toBeGreaterThan(0);
          // Check max 3 lines per dialogue card
          const lineCount = card.text.split('\n').length;
          expect(lineCount).toBeLessThanOrEqual(3);
        });
      });
    });

    expect(totalScenes).toBe(48);
  });

  it('correctly navigates scenes using getNextStoryScene', () => {
    const next1 = getNextStoryScene(1, 1);
    expect(next1).toEqual({ chapterId: 1, sceneId: 2, isCompleted: false });

    const endOfCh1 = getNextStoryScene(1, 12);
    expect(endOfCh1).toEqual({ chapterId: 2, sceneId: 1, isCompleted: false });

    const finalScene = getNextStoryScene(4, 12);
    expect(finalScene.isCompleted).toBe(true);
  });

  it('contains zero competitor names or banned IP terms', () => {
    const rawData = JSON.stringify({
      STORY_CHAPTERS,
      CORE_CHARACTERS,
      RECURRING_CUSTOMERS,
      RANG_BOOK_PAGES,
    }).toLowerCase();

    expect(rawData).not.toContain('just desserts');
    expect(rawData).not.toContain('century games');
    expect(rawData).not.toContain('candy crush');
    expect(rawData).not.toContain('block blast');
  });
});
