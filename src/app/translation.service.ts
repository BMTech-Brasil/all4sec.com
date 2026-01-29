import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS } from './translations';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLangCode = signal<'PT' | 'EN' | 'ES'>('EN');
    public t = computed(() => TRANSLATIONS[this.currentLangCode()]);

    setLanguage(code: 'PT' | 'EN' | 'ES') {
        this.currentLangCode.set(code);
    }
    
    getCurrentLang() {
        return this.currentLangCode();
    }
}