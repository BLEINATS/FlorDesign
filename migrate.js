import fs from 'fs';
import path from 'path';

// Função para mover arquivos sobrescrevendo o destino
const moveFile = (src, dest) => {
  if (fs.existsSync(src)) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    // Copia e depois deleta para garantir (renameSync pode falhar entre partições, embora improvável aqui)
    fs.cpSync(src, dest, { force: true });
    fs.rmSync(src);
    console.log(`Moved ${src} to ${dest}`);
  }
};

// Função para mover conteúdo de pastas
const moveFolderContent = (srcDir, destDir) => {
    if (!fs.existsSync(srcDir)) return;
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        const stat = fs.lstatSync(srcPath);
        
        if (stat.isDirectory()) {
            moveFolderContent(srcPath, destPath);
        } else {
            fs.cpSync(srcPath, destPath, { force: true });
            fs.rmSync(srcPath);
            console.log(`Moved ${srcPath} to ${destPath}`);
        }
    }
};

const deleteFolder = (dir) => {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted folder ${dir}`);
    }
}

console.log("Iniciando migração para pasta src/...");

// 1. Mover arquivos soltos da raiz para src
moveFile('App.tsx', 'src/App.tsx');
moveFile('index.tsx', 'src/index.tsx');
moveFile('types.ts', 'src/types.ts');

// 2. Mover pastas da raiz para src
moveFolderContent('components', 'src/components');
moveFolderContent('hooks', 'src/hooks');
moveFolderContent('services', 'src/services');

// 3. Limpar pastas vazias na raiz
deleteFolder('components');
deleteFolder('hooks');
deleteFolder('services');

console.log("Migração concluída com sucesso!");
