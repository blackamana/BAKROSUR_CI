# ============================================
# 1. STRUCTURE DU PROJET
# ============================================
Write-Host "=== STRUCTURE APP ===" -ForegroundColor Green
Get-ChildItem "app" -Recurse -Directory | Select-Object -First 20 | ForEach-Object { Write-Host $_.FullName.Replace((Get-Location).Path, ".") }

Write-Host "`n=== FICHIERS DANS APP/(TABS) ===" -ForegroundColor Green
Get-ChildItem "app/(tabs)" -File | ForEach-Object { Write-Host $_.Name }

# ============================================
# 2. VÉRIFIER FICHIERS CRITIQUES
# ============================================
Write-Host "`n=== FICHIERS CRITIQUES ===" -ForegroundColor Green

$files = @(
    "app/(tabs)/_layout.tsx",
    "app/(tabs)/map.tsx",
    "app/(tabs)/messages.tsx",
    "app/(tabs)/transactions.tsx",
    "contexts/AuthContext.tsx",
    "metro.config.js",
    "webpack.config.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MANQUANT: $file" -ForegroundColor Red
    }
}

# ============================================
# 3. ANALYSER MAP.TSX
# ============================================
Write-Host "`n=== ANALYSE MAP.TSX ===" -ForegroundColor Green

if (Test-Path "app/(tabs)/map.tsx") {
    Write-Host "Fichier existe" -ForegroundColor Green
    
    # Premières lignes
    Write-Host "`nPremières 40 lignes:" -ForegroundColor Cyan
    Get-Content "app/(tabs)/map.tsx" -Head 40
    
    # Recherche imports problématiques
    Write-Host "`nRecherche 'import' + 'react-native-maps':" -ForegroundColor Cyan
    $imports = Select-String -Path "app/(tabs)/map.tsx" -Pattern "import.*react-native-maps" -AllMatches
    if ($imports) {
        Write-Host "PROBLEME: Import direct detecte!" -ForegroundColor Red
        $imports | ForEach-Object { Write-Host $_.Line }
    } else {
        Write-Host "OK: Pas d'import direct" -ForegroundColor Green
    }
    
    # Recherche Platform.OS
    Write-Host "`nRecherche 'Platform.OS':" -ForegroundColor Cyan
    $platform = Select-String -Path "app/(tabs)/map.tsx" -Pattern "Platform\.OS" -AllMatches
    if ($platform) {
        Write-Host "OK: Platform.OS trouve" -ForegroundColor Green
        $platform | Select-Object -First 3 | ForEach-Object { Write-Host $_.Line }
    } else {
        Write-Host "PROBLEME: Platform.OS absent!" -ForegroundColor Red
    }
    
} else {
    Write-Host "ERREUR: map.tsx n'existe pas!" -ForegroundColor Red
}

# ============================================
# 4. VÉRIFIER WEBPACK
# ============================================
Write-Host "`n=== WEBPACK.CONFIG.JS ===" -ForegroundColor Green

if (Test-Path "webpack.config.js") {
    Write-Host "ATTENTION: webpack.config.js existe (devrait etre supprime)" -ForegroundColor Yellow
    Write-Host "Contenu:" -ForegroundColor Cyan
    Get-Content "webpack.config.js"
} else {
    Write-Host "OK: webpack.config.js n'existe pas" -ForegroundColor Green
}

# ============================================
# 5. VÉRIFIER METRO CONFIG
# ============================================
Write-Host "`n=== METRO.CONFIG.JS ===" -ForegroundColor Green

if (Test-Path "metro.config.js") {
    Write-Host "OK: metro.config.js existe" -ForegroundColor Green
    Write-Host "Contenu:" -ForegroundColor Cyan
    Get-Content "metro.config.js"
} else {
    Write-Host "MANQUANT: metro.config.js" -ForegroundColor Yellow
}

# ============================================
# 6. PACKAGE.JSON - DÉPENDANCES
# ============================================
Write-Host "`n=== DEPENDANCES ===" -ForegroundColor Green

if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    
    $deps = @("react-native-maps", "expo-location", "expo-router", "react", "react-native")
    
    foreach ($dep in $deps) {
        if ($pkg.dependencies.$dep) {
            Write-Host "OK: $dep = $($pkg.dependencies.$dep)" -ForegroundColor Green
        } else {
            Write-Host "MANQUANT: $dep" -ForegroundColor Red
        }
    }
}

# ============================================
# 7. RÉSUMÉ
# ============================================
Write-Host "`n=== RESUME ===" -ForegroundColor Cyan
Write-Host "Executez ces commandes pour corriger:" -ForegroundColor White
Write-Host "1. Si webpack.config.js existe: Remove-Item webpack.config.js" -ForegroundColor Yellow
Write-Host "2. Verifiez que map.tsx utilise Platform.OS" -ForegroundColor Yellow
Write-Host "3. Relancez: npx expo start --clear" -ForegroundColor Yellow