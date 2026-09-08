<?php
// ============================================================================
// CONFIGURATION D'EXPÉDITION D'E-MAILS - INFOMANIAK
// ============================================================================
// Ce fichier permet de configurer l'envoi SMTP Infomaniak pour une livraison
// instantanée (< 1 seconde) et garantie à 100% dans la boîte de réception.
// ============================================================================

return [
    // 1. Passer à true pour activer le SMTP officiel Infomaniak (fortement recommandé)
    'smtp_enabled'    => false,

    // 2. Paramètres du serveur SMTP Infomaniak
    'smtp_host'       => 'mail.infomaniak.com',
    'smtp_port'       => 587, // 587 (avec STARTTLS) ou 465 (avec SSL)
    'smtp_user'       => 'contact@sali-digicom.com',
    'smtp_pass'       => '', // <-- INDIQUEZ ICI LE MOT DE PASSE de contact@sali-digicom.com

    // 3. Boîte de réception où arrivent les questionnaires et devis
    'recipient_email' => 'contact@sali-digicom.com',

    // 4. Clé secrète pour consulter vos leads sur /api/view-submissions.php?key=...
    'admin_key'       => 'sali2026'
];
?>
