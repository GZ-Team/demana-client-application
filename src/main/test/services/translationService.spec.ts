import { describe, it, expect } from '@jest/globals'

import TranslationService from '../../services/translationService'

describe('[TranslationService] General', () => {
    const translationService = new TranslationService()

    it('should not be null', () => {
        expect(translationService).not.toBeNull()
    })

    it('should be possible to get the available translated locale codes', () => {
        expect(translationService.availableLocaleCodes).not.toBeNull()
        expect(translationService.availableLocaleCodes.length).toBeGreaterThanOrEqual(1)
    })

    it('should be possible to get a translations object', () => {
        expect(translationService.translations).not.toBeNull()
    })

    it('should be possible to use translations', () => {
        const { translate } = translationService

        const noneExistingTranslation = translate('this.key.does.not.exist')

        expect(noneExistingTranslation).not.toBeNull()
        expect(noneExistingTranslation).toBe('this.key.does.not.exist')

        const runningInBackgroundTitleTranslation = translate(
            'notifications.runningInBackground.title'
        )

        expect(runningInBackgroundTitleTranslation).not.toBeNull()
        expect(runningInBackgroundTitleTranslation).toBe('The application is not closed.')
    })
})
