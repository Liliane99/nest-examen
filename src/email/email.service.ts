import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, 
      secure: false,
      ignoreTLS: true,
    } as any);
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
    
    const mailOptions = {
      from: '"Watchlist App" <noreply@watchlist.com>',
      to: email,
      subject: 'Vérifiez votre adresse email - Watchlist App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">🎬 Bienvenue sur Watchlist App!</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #34495e;">
              Merci de vous être inscrit ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Vérifier mon email
              </a>
            </div>
            
            <p style="font-size: 14px; color: #7f8c8d;">
              Ou copiez et collez ce lien dans votre navigateur :
            </p>
            <p style="background-color: #ecf0f1; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px;">
              ${verificationUrl}
            </p>
          </div>
          
          <div style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 30px;">
            <p>Token de vérification : <code>${token}</code></p>
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email de vérification:', error);
      return false;
    }
  }

  async sendTwoFactorCode(email: string, code: string) {
    const mailOptions = {
      from: '"Watchlist App" <noreply@watchlist.com>',
      to: email,
      subject: 'Code de connexion 2FA - Watchlist App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">🔐 Code de connexion</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #34495e;">
              Voici votre code de connexion à usage unique :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #2c3e50; color: white; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${code}
              </div>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⏰ Important :</p>
              <ul style="color: #856404; margin: 10px 0;">
                <li>Ce code expire dans <strong>10 minutes</strong></li>
                <li>Il ne peut être utilisé qu'une seule fois</li>
                <li>Ne le partagez avec personne</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 30px;">
            <p>🎬 Si vous n'avez pas tenté de vous connecter, ignorez cet email.</p>
            <p>Votre sécurité est notre priorité !</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi code 2FA:', error);
      return false;
    }
  }
}
