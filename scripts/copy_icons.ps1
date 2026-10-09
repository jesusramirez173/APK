$logo = 'c:/Users/MARIA/Downloads/APK/public/logo.png'
$folders = @('mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi')

foreach ($f in $folders) {
    $dir = "c:/Users/MARIA/Downloads/APK/android/app/src/main/res/$f"
    Copy-Item -Path $logo -Destination "$dir/ic_launcher.png" -Force
    Copy-Item -Path $logo -Destination "$dir/ic_launcher_round.png" -Force
    Copy-Item -Path $logo -Destination "$dir/ic_launcher_foreground.png" -Force
}

$splashFolders = @('drawable', 'drawable-port-hdpi', 'drawable-port-mdpi', 'drawable-port-xhdpi', 'drawable-port-xxhdpi', 'drawable-port-xxxhdpi')
foreach ($sf in $splashFolders) {
    $dir = "c:/Users/MARIA/Downloads/APK/android/app/src/main/res/$sf"
    Copy-Item -Path $logo -Destination "$dir/splash.png" -Force
}

Write-Output 'ICONS_COPIED_SUCCESSFULLY'
