# Tourne en tâche planifiée sur le Desktop (toutes les ~5 min). N'endort la
# machine que si elle est inactive à la fois LOCALEMENT (souris/clavier) ET
# côté site (pas de requête chatbot récente) — cf. docs/architecture.md.
# Sens de communication volontairement à sens unique : ce script interroge le
# site, jamais l'inverse (le Pi ne peut pas forcer la mise en veille du Desktop).

$ErrorActionPreference = "Stop"

$SiteActivityUrl = "https://hernandes.cloud/api/activity?target=desktop"
$IdleThresholdMinutes = 15
$GraceAfterWakeMinutes = 2  # ne jamais s'endormir juste après un réveil déclenché par le site

Add-Type @'
using System;
using System.Runtime.InteropServices;

public static class IdleTime {
    [StructLayout(LayoutKind.Sequential)]
    struct LASTINPUTINFO {
        public uint cbSize;
        public uint dwTime;
    }

    [DllImport("user32.dll")]
    static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

    public static uint GetIdleMilliseconds() {
        LASTINPUTINFO lii = new LASTINPUTINFO();
        lii.cbSize = (uint)Marshal.SizeOf(lii);
        GetLastInputInfo(ref lii);
        return (uint)Environment.TickCount - lii.dwTime;
    }
}
'@

$localIdleMinutes = [IdleTime]::GetIdleMilliseconds() / 1000 / 60

if ($localIdleMinutes -lt $IdleThresholdMinutes) {
    Write-Output "Actif localement il y a $([math]::Round($localIdleMinutes, 1)) min — pas de mise en veille."
    exit 0
}

try {
    $response = Invoke-RestMethod -Uri $SiteActivityUrl -TimeoutSec 10
} catch {
    Write-Output "Impossible de contacter le site ($_) — pas de mise en veille par prudence."
    exit 0
}

if ($null -eq $response.lastActivity) {
    # Aucune activité site enregistrée depuis le démarrage du serveur Next.js :
    # on se fie uniquement à l'inactivité locale, déjà confirmée ci-dessus.
    $siteIdleMinutes = [double]::PositiveInfinity
} else {
    $lastActivityDate = [DateTimeOffset]::FromUnixTimeMilliseconds([int64]$response.lastActivity)
    $siteIdleMinutes = ((Get-Date) - $lastActivityDate.LocalDateTime).TotalMinutes
}

if ($siteIdleMinutes -lt $GraceAfterWakeMinutes) {
    Write-Output "Réveillée récemment par le site il y a $([math]::Round($siteIdleMinutes, 1)) min — grâce période, pas de mise en veille."
    exit 0
}

if ($siteIdleMinutes -lt $IdleThresholdMinutes) {
    Write-Output "Site actif il y a $([math]::Round($siteIdleMinutes, 1)) min — pas de mise en veille."
    exit 0
}

Write-Output "Inactif localement ($([math]::Round($localIdleMinutes,1)) min) et côté site ($([math]::Round($siteIdleMinutes,1)) min) — mise en veille."
rundll32.exe powrprof.dll,SetSuspendState 0,1,0

