<?php
// ============================================================================
// CONFIGURATION D'EXPÉDITION D'E-MAILS - INFOMANIAK
// ============================================================================
// contact@sali-digicom.com est une redirection vers Christian et M. Hicham.
// Pour que le serveur SMTP Infomaniak accepte d'envoyer l'e-mail, on s'authentifie
// avec le compte réel christian.kouassi@sali-digicom.com.
// Dès réception, la redirection contact@ redistribue le mail à vous deux !
// ============================================================================

return [
    // 1. Passer à true pour activer le SMTP officiel Infomaniak
    'smtp_enabled'    => true,

    // 2. Paramètres du serveur SMTP Infomaniak
    'smtp_host'       => 'mail.infomaniak.com',
    'smtp_port'       => 587, // 587 (STARTTLS) ou 465 (SSL)
    'smtp_user'       => 'christian.kouassi@sali-digicom.com', // Compte réel
    'smtp_pass'       => '', // <-- INDIQUEZ ICI LE MOT DE PASSE de votre boîte christian.kouassi@sali-digicom.com

    // 3. Adresse de redirection (qui renvoie vers Christian ET M. Hicham)
    'recipient_email' => 'contact@sali-digicom.com',

    // 4. Clé secrète pour consulter vos leads sauvegardés sur /api/view-submissions.php?key=...
    'admin_key'       => 'sali2026'
];
?>
