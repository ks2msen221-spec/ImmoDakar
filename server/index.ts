/**
 * ImmoDakar — Express API Server
 * Runs on port 3001, proxified by Vite on /api/*
 * Handles: contact form submission → Supabase leads table + Resend email
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const app = express();
app.use(express.json());

// ─── Supabase Admin Client (service key — NEVER sent to client) ─────────────
const rawUrl = process.env.SUPABASE_URL || '';
// Strip /rest/v1/ suffix if present — createClient needs the base project URL
const SUPABASE_BASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_BASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes dans .env.local');
}

const supabaseAdmin = createClient(SUPABASE_BASE_URL, SUPABASE_SERVICE_KEY);

// ─── Resend Email Client ─────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY || '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

// ─── POST /api/contact ───────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { nom, email, telephone, message, type_demande, bien_ref, source } = req.body;

    // Validation
    if (!nom || nom.trim().length < 2) {
      return res.status(400).json({
        error: 'Le nom est obligatoire (minimum 2 caractères).'
      });
    }

    if (!telephone || telephone.trim().length < 8) {
      return res.status(400).json({
        error: 'Le numéro de téléphone est obligatoire.'
      });
    }

    const validTypes = ['achat', 'location', 'btp', 'contact'];
    const finalType = validTypes.includes(type_demande) ? type_demande : 'contact';

    // ── 1. Insert into Supabase leads table ──
    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .insert([{
        nom: nom.trim(),
        email: email?.trim() || null,
        telephone: telephone.trim(),
        message: message?.trim() || null,
        type_demande: finalType,
        bien_ref: bien_ref || null,
        source: source || 'formulaire_contact',
      }]);

    if (dbError) {
      console.error('❌ Supabase error:', dbError);
      return res.status(500).json({
        error: "Erreur lors de l'enregistrement. Veuillez réessayer."
      });
    }

    console.log(`✅ Lead enregistré : ${nom} (${telephone})`);

    // ── 2. Send email notification via Resend ──
    if (ADMIN_EMAIL && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ImmoDakar <noreply@immodakar.sn>',
          to: ADMIN_EMAIL,
          subject: `🏠 Nouveau lead ImmoDakar — ${nom}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="background: #2d6a3f; padding: 24px 32px;">
                <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 600;">
                  🏠 Nouveau contact ImmoDakar
                </h1>
                <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">
                  Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Dakar' })}
                </p>
              </div>
              <div style="background: #f4f8f5; padding: 24px 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 140px;">Nom</td>
                    <td style="padding: 12px 0; color: #0f1f14; font-weight: 600; font-size: 14px;">${nom.trim()}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</td>
                    <td style="padding: 12px 0; color: #0f1f14; font-weight: 600; font-size: 14px;">
                      <a href="tel:${telephone.trim()}" style="color: #2d6a3f; text-decoration: none;">${telephone.trim()}</a>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                    <td style="padding: 12px 0; color: #0f1f14; font-size: 14px;">${email?.trim() || '<em style="color:#9ca3af">Non renseigné</em>'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Type de demande</td>
                    <td style="padding: 12px 0;">
                      <span style="background: #2d6a3f; color: white; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 600;">${finalType}</span>
                    </td>
                  </tr>
                  ${bien_ref ? `
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Référence bien</td>
                    <td style="padding: 12px 0; color: #0f1f14; font-size: 14px; font-family: monospace;">${bien_ref}</td>
                  </tr>` : ''}
                  <tr style="border-bottom: 1px solid #e2ede6;">
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Message</td>
                    <td style="padding: 12px 0; color: #374840; font-size: 13px; line-height: 1.6;">${message?.trim() || '<em style="color:#9ca3af">Aucun message</em>'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #6b8070; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Source</td>
                    <td style="padding: 12px 0; color: #6b8070; font-size: 13px;">${source || 'formulaire_contact'}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #c8ddd0;">
                  <a href="https://immodakar.sn/admin"
                    style="display: inline-block; background: #2d6a3f; color: white; padding: 12px 24px;
                           border-radius: 100px; text-decoration: none;
                           font-size: 13px; font-weight: 600;">
                    Voir dans le panel admin →
                  </a>
                  <a href="https://wa.me/221763965075?text=Bonjour%20${encodeURIComponent(nom.trim())}%2C"
                    style="display: inline-block; background: #25d366; color: white; padding: 12px 24px;
                           border-radius: 100px; text-decoration: none; margin-left: 10px;
                           font-size: 13px; font-weight: 600;">
                    Répondre sur WhatsApp →
                  </a>
                </div>
              </div>
              <div style="background: #e8f1eb; padding: 12px 32px; text-align: center;">
                <p style="margin: 0; color: #6b8070; font-size: 11px;">ImmoDakar · Yoff, Dakar, Sénégal · +221 76 396 50 75</p>
              </div>
            </div>
          `
        });
        console.log(`📧 Email envoyé à ${ADMIN_EMAIL}`);
      } catch (emailError) {
        // Email failure is non-blocking — lead is already saved
        console.warn('⚠️ Email notification failed (lead saved):', emailError);
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ API error:', error);
    return res.status(500).json({
      error: 'Une erreur inattendue est survenue.'
    });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    supabase: !!SUPABASE_BASE_URL,
    resend: !!process.env.RESEND_API_KEY,
    adminEmail: ADMIN_EMAIL || 'non configuré'
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 ImmoDakar API Server démarré sur http://localhost:${PORT}`);
  console.log(`   Supabase : ${SUPABASE_BASE_URL ? '✅ configuré' : '❌ manquant'}`);
  console.log(`   Resend   : ${process.env.RESEND_API_KEY ? '✅ configuré' : '❌ manquant'}`);
  console.log(`   Admin    : ${ADMIN_EMAIL || '❌ manquant'}\n`);
});
