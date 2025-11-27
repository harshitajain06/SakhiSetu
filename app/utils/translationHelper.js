import enTranslations from '../../contexts/translations/en';
import hiTranslations from '../../contexts/translations/hi';

/**
 * Get translated content for a module item
 * @param {string} language - Current language ('en' or 'hi')
 * @param {string} moduleKey - Module key (e.g., 'stayingCleanItems', 'wellbeingConfidenceItems')
 * @param {number} itemId - Item ID
 * @param {object} fallbackItem - Original item with English content as fallback
 * @returns {object} Translated item with title, content, tips, importantNote
 */
export const getTranslatedItem = (language, moduleKey, itemId, fallbackItem) => {
  try {
    const currentTranslations = language === 'hi' ? hiTranslations : enTranslations;
    const itemKey = `item${itemId}`;
    
    // Try to get from menstrual section first (for menstrual health modules)
    let translatedItem = currentTranslations?.menstrual?.[moduleKey]?.[itemKey];
    
    // If not found, try other sections (for maternal health modules)
    if (!translatedItem) {
      translatedItem = currentTranslations?.learn?.[moduleKey]?.[itemKey] ||
                      currentTranslations?.[moduleKey.replace('Items', '')]?.[moduleKey]?.[itemKey];
    }
    
    if (translatedItem) {
      return {
        title: translatedItem.title || fallbackItem.title,
        content: translatedItem.content || fallbackItem.content,
        tips: translatedItem.tips || fallbackItem.tips || [],
        importantNote: translatedItem.importantNote || fallbackItem.importantNote
      };
    }
  } catch (error) {
    console.log('Translation error:', error);
  }
  
  // Fallback to original item
  return {
    title: fallbackItem.title,
    content: fallbackItem.content,
    tips: fallbackItem.tips || [],
    importantNote: fallbackItem.importantNote
  };
};

/**
 * Get translated title for a module item
 * @param {string} language - Current language ('en' or 'hi')
 * @param {string} moduleKey - Module key (e.g., 'stayingCleanItems', 'wellbeingConfidenceItems')
 * @param {number} itemId - Item ID
 * @param {string} fallbackTitle - Original English title as fallback
 * @returns {string} Translated title
 */
export const getTranslatedTitle = (language, moduleKey, itemId, fallbackTitle) => {
  try {
    const currentTranslations = language === 'hi' ? hiTranslations : enTranslations;
    const itemKey = `item${itemId}`;
    
    // Try to get from menstrual section first (for menstrual health modules)
    let translatedTitle = currentTranslations?.menstrual?.[moduleKey]?.[itemKey]?.title;
    
    // If not found, try other sections (for maternal health modules)
    if (!translatedTitle) {
      translatedTitle = currentTranslations?.learn?.[moduleKey]?.[itemKey]?.title ||
                       currentTranslations?.[moduleKey.replace('Items', '')]?.[moduleKey]?.[itemKey]?.title;
    }
    
    return translatedTitle || fallbackTitle;
  } catch (error) {
    console.log('Translation error:', error);
    return fallbackTitle;
  }
};

