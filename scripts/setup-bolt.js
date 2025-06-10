#!/usr/bin/env node

/**
 * Script para configurar el proyecto para Bolt.new
 * Ejecutar con: node scripts/setup-bolt.js
 */

const fs = require('fs');
const path = require('path');

const LAYOUT_PATH = path.join(__dirname, '..', 'app', 'layout.tsx');
const LAYOUT_BACKUP_PATH = path.join(__dirname, '..', 'app', 'layout.tsx.backup');

function setupForBolt() {
  try {
    console.log('🚀 Configurando proyecto para Bolt.new...');
    
    // Leer el archivo layout.tsx actual
    const layoutContent = fs.readFileSync(LAYOUT_PATH, 'utf8');
    
    // Crear backup si no existe
    if (!fs.existsSync(LAYOUT_BACKUP_PATH)) {
      fs.writeFileSync(LAYOUT_BACKUP_PATH, layoutContent);
      console.log('✅ Backup del layout original creado');
    }
    
    // Reemplazar la importación del AuthProvider
    const updatedContent = layoutContent.replace(
      "import { AuthProvider } from '@/components/auth/AuthProvider';",
      "import { AuthProviderBolt as AuthProvider } from '@/components/auth/AuthProviderBolt';"
    );
    
    // Escribir el archivo actualizado
    fs.writeFileSync(LAYOUT_PATH, updatedContent);
    
    console.log('✅ Layout actualizado para usar AuthProviderBolt');
    console.log('\n📋 Pasos siguientes:');
    console.log('1. Configura las variables de entorno en Bolt.new:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('2. Ejecuta los scripts SQL de la carpeta database/ en Supabase');
    console.log('3. ¡Tu proyecto está listo para Bolt.new!');
    
  } catch (error) {
    console.error('❌ Error configurando para Bolt.new:', error.message);
    process.exit(1);
  }
}

function restoreOriginal() {
  try {
    console.log('🔄 Restaurando configuración original...');
    
    if (!fs.existsSync(LAYOUT_BACKUP_PATH)) {
      console.log('❌ No se encontró backup del layout original');
      return;
    }
    
    // Restaurar desde el backup
    const backupContent = fs.readFileSync(LAYOUT_BACKUP_PATH, 'utf8');
    fs.writeFileSync(LAYOUT_PATH, backupContent);
    
    console.log('✅ Configuración original restaurada');
    console.log('✅ Ahora puedes usar el proyecto con los helpers de Next.js');
    
  } catch (error) {
    console.error('❌ Error restaurando configuración original:', error.message);
    process.exit(1);
  }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'setup':
  case 'bolt':
    setupForBolt();
    break;
  case 'restore':
  case 'original':
    restoreOriginal();
    break;
  default:
    console.log('🔧 Script de configuración para Bolt.new');
    console.log('\nUso:');
    console.log('  node scripts/setup-bolt.js setup   - Configurar para Bolt.new');
    console.log('  node scripts/setup-bolt.js restore - Restaurar configuración original');
    break;
}