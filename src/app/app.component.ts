import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from './translation.service';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  translationService = inject(TranslationService);
  t = this.translationService.t;

  title = 'parceria-digicert';

  languages = [
    { code: 'PT', flagUrl: 'https://flagcdn.com/w40/br.png', name: 'Português' },
    { code: 'EN', flagUrl: 'https://flagcdn.com/w40/us.png', name: 'English' },
    { code: 'ES', flagUrl: 'https://flagcdn.com/w40/es.png', name: 'Español' }
  ];

  currentLang = this.languages[1];
  isLangMenuOpen = false;

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

setLanguage(lang: any) {
    this.currentLang = lang;
    this.isLangMenuOpen = false;
    this.translationService.setLanguage(lang.code);
  }

  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: ''
  };
  isModalOpen = false;

  solutions = [
    {
      title: 'Certificados Code Signing',
      icon: '🔐',
      description: 'Garanta a integridade do seu software. Assine executáveis e scripts para evitar alertas de segurança.',
      link: '#code-signing'
    },
    {
      title: 'Certificados SSL/TLS',
      icon: '🛡️',
      description: 'Criptografia robusta para sites e servidores. Do DV básico ao EV para máxima confiança.',
      link: '#ssl-tls'
    },
    {
      title: 'Document Signing',
      icon: '✍️',
      description: 'Assinaturas digitais juridicamente vinculativas para PDFs e documentos corporativos.',
      link: '#doc-signing'
    }
  ];

  products = [
    { category: 'SSL/TLS', name: 'Single Domain', description: 'Proteção padrão para um único domínio (FQDN).' },
    { category: 'SSL/TLS', name: 'Multi Domain (SAN)', description: 'Proteja múltiplos domínios e subdomínios em um único certificado.' },
    { category: 'SSL/TLS', name: 'Wildcard Domain', description: 'Segurança ilimitada para um domínio e todos os seus subdomínios (*.site.com).' },
    { category: 'Assinatura', name: 'Code Signing', description: 'Assinatura digital para desenvolvedores de software e drivers.' },
    { category: 'Assinatura', name: 'Document Signing', description: 'Assinatura confiável para Adobe PDF, Microsoft Office e DocuSign.' },
    { category: 'E-mail', name: 'S/MIME Email', description: 'Criptografia ponta-a-ponta e identidade verificada para comunicações.' },
    { category: 'Identidade', name: 'Mark Certificates (VMC)', description: 'Exiba seu logotipo verificado no e-mail do cliente (Padrão BIMI).' }
  ];

  scrollToSolutions() {
    const element = document.getElementById('solutions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openModal(interestContext: string = 'Geral') {
    this.formData.interest = interestContext;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async submitForm() {
    if (!this.formData.name || !this.formData.email || !this.formData.phone) {
      alert('Por favor, preenchas os campos obrigatórios.');
      return;
    }

    const serviceID = 'service_wicgz2n';
    const templateID = 'template_sqw8cgm';
    const publicKey = 'VX_4H1EvvH3z8KwWC';

    const templateParams = {
      from_name: this.formData.name,
      company: this.formData.company,
      phone: this.formData.phone,
      reply_to: this.formData.email,
      product: this.formData.interest,
      language: this.currentLang.name
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      alert('Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.');
      this.closeModal();

      this.formData = { name: '', company: '', email: '', phone: '', interest: ''};

    } catch (error) {
      console.error('Erro no envio automático: ', error);

      alert('Houve uma falha de conexão. Abriremos seu e-mail para envio manual.');

      const targetEmail = 'aparicio@all4sec.com';
      const subject = `Cotação Site All4Sec [{${this.currentLang.code}]: ${this.formData.interest}`;

      const body = 
`Prezados,

Gostaria de solicitar uma cotação referente a produtos DigiCert.

DADOS DO CLIENTE:
-------------------------------------------------
Nome: ${this.formData.name}
Empresa: ${this.formData.company}
Telefone: ${this.formData.phone}
E-mail: ${this.formData.email}

DETALHES:
-------------------------------------------------
Produto: ${this.formData.interest}
Idioma: ${this.currentLang.name}

-------------------------------------------------
Mensagem enviada via Formulário do Site`;

      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      this.closeModal();
    }
  }
}