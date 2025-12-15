#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Nettoyage complet du projet...');

// Supprimer .next
if (fs.existsSync('.next')) {
    console.log('📁 Suppression du dossier .next...');
    fs.rmSync('.next', { recursive: true, force: true });
}

// Supprimer node_modules/.cache
if (fs.existsSync('node_modules/.cache')) {
    console.log('📁 Suppression du cache node_modules...');
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
}

// Supprimer .turbo si il existe
if (fs.existsSync('.turbo')) {
    console.log('📁 Suppression du dossier .turbo...');
    fs.rmSync('.turbo', { recursive: true, force: true });
}

console.log('✅ Nettoyage terminé !');
console.log('💡 Redémarrez le serveur avec: npm run dev');
