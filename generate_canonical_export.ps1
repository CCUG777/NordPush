$ProgressPreference='SilentlyContinue'
$ErrorActionPreference='Stop'

function Normalize-Url([Uri]$uri) {
  $builder = New-Object System.UriBuilder($uri)
  $builder.Fragment = ''
  $builder.Query = ''
  $normalized = $builder.Uri.AbsoluteUri
  if ($normalized.EndsWith('/index.html')) { $normalized = $normalized.Substring(0, $normalized.Length - 10) }
  return $normalized
}

function Clean-Text([string]$s) {
  if (-not $s) { return '' }
  $t = [System.Text.RegularExpressions.Regex]::Replace($s, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = [System.Text.RegularExpressions.Regex]::Replace($t, '\s+', ' ').Trim()
  return $t
}

function Get-Meta([string]$html, [string]$pattern) {
  $m = [regex]::Match($html, $pattern, 'IgnoreCase, Singleline')
  if ($m.Success) { return Clean-Text $m.Groups[1].Value }
  return ''
}

function Get-PageType([string]$url) {
  $u = [uri]$url
  $p = $u.AbsolutePath.ToLowerInvariant()
  if ($p -eq '/') { return 'homepage' }
  if ($p.StartsWith('/category/')) { return 'blog_category' }
  if ($p.StartsWith('/tag/')) { return 'tag_archive' }
  if ($p.StartsWith('/ueber-uns/')) { return 'about_or_author' }
  if ($p -in @('/impressum/','/datenschutz/','/kontakt/','/preise/')) { return 'info_legal_or_conversion' }
  if ($p -match '^/seo-(neumuenster|sachsen|bamberg)/$') { return 'local_seo' }
  if ($p -match '^/(seo-beratung|seo-audit|seo-strategie|seo-konkurrenzanalyse|keyword-recherche|technisches-seo-audit|seo-relaunch|e-commerce-seo|wordpress-seo|pagespeed-optimierung|content-templates|seo-betreuung|b2b-seo-agentur|seo-fuer-lokale-unternehmen|seo-monitoring|internationales-seo|link-risk-management|backlinks|content-marketing|seo-texte-schreiben|geo-optimierung|google-unternehmensprofil|etsy-seo)/$') { return 'service' }
  return 'blog_or_other'
}

$patTitle = @'
<title[^>]*>(.*?)</title>
'@
$patDescA = @'
<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["'](.*?)["']
'@
$patDescB = @'
<meta[^>]+content\s*=\s*["'](.*?)["'][^>]+name\s*=\s*["']description["']
'@
$patCanA = @'
<link[^>]+rel\s*=\s*["']canonical["'][^>]+href\s*=\s*["'](.*?)["']
'@
$patCanB = @'
<link[^>]+href\s*=\s*["'](.*?)["'][^>]+rel\s*=\s*["']canonical["']
'@
$patH1 = @'
<h1[^>]*>(.*?)</h1>
'@
$patOgTitle = @'
<meta[^>]+property\s*=\s*["']og:title["'][^>]+content\s*=\s*["'](.*?)["']
'@
$patOgDesc = @'
<meta[^>]+property\s*=\s*["']og:description["'][^>]+content\s*=\s*["'](.*?)["']
'@
$patSrc = @'
src\s*=\s*["'](.*?)["']
'@
$patDataSrc = @'
data-src\s*=\s*["'](.*?)["']
'@
$patAlt = @'
alt\s*=\s*["'](.*?)["']
'@
$patLinks = @'
<a[^>]+href\s*=\s*["'](.*?)["']
'@

$domain = 'nordpush.de'
$maxPages = 500
$queue = New-Object System.Collections.Generic.Queue[string]
$queue.Enqueue('https://nordpush.de/')
$known = New-Object 'System.Collections.Generic.HashSet[string]'
$known.Add('https://nordpush.de/') | Out-Null
$visited = New-Object 'System.Collections.Generic.HashSet[string]'

$pages = @()
$imageRows = @()

while ($queue.Count -gt 0 -and $visited.Count -lt $maxPages) {
  $url = $queue.Dequeue()
  if ($visited.Contains($url)) { continue }
  $visited.Add($url) | Out-Null

  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45 -MaximumRedirection 5
    $finalUrl = Normalize-Url ([Uri]$resp.BaseResponse.ResponseUri)
    if (-not $visited.Contains($finalUrl)) { $visited.Add($finalUrl) | Out-Null }
    $status = [int]$resp.StatusCode
    $html = $resp.Content

    if ($status -eq 200 -and $html) {
      $title = Get-Meta $html $patTitle
      $metaDescription = Get-Meta $html $patDescA
      if (-not $metaDescription) { $metaDescription = Get-Meta $html $patDescB }
      $canonical = Get-Meta $html $patCanA
      if (-not $canonical) { $canonical = Get-Meta $html $patCanB }
      $h1 = Get-Meta $html $patH1
      $ogTitle = Get-Meta $html $patOgTitle
      $ogDescription = Get-Meta $html $patOgDesc

      $pages += [pscustomobject]@{
        url = $finalUrl
        path = ([Uri]$finalUrl).AbsolutePath
        pageType = Get-PageType $finalUrl
        title = $title
        metaDescription = $metaDescription
        canonical = $canonical
        h1 = $h1
        ogTitle = $ogTitle
        ogDescription = $ogDescription
        source = 'internal_crawl'
        statusCode = $status
      }

      $imgMatches = [regex]::Matches($html, '<img[^>]*>', 'IgnoreCase, Singleline')
      foreach ($im in $imgMatches) {
        $tag = $im.Value
        $src = Get-Meta $tag $patSrc
        if (-not $src) { $src = Get-Meta $tag $patDataSrc }
        $alt = Get-Meta $tag $patAlt
        if ($src) {
          try { $srcAbs = Normalize-Url ([Uri]::new([Uri]$finalUrl, $src)) } catch { $srcAbs = $src }
          $imageRows += [pscustomobject]@{
            sourcePageUrl = $finalUrl
            sourcePagePath = ([Uri]$finalUrl).AbsolutePath
            imageSrc = $srcAbs
            imageAlt = $alt
          }
        }
      }

      $linkMatches = [regex]::Matches($html, $patLinks, 'IgnoreCase, Singleline')
      foreach ($m in $linkMatches) {
        $href = $m.Groups[1].Value.Trim()
        if (-not $href) { continue }
        if ($href.StartsWith('#') -or $href.StartsWith('mailto:') -or $href.StartsWith('tel:') -or $href.StartsWith('javascript:')) { continue }
        try {
          $candidate = Normalize-Url ([Uri]::new([Uri]$finalUrl, $href))
          $cu = [Uri]$candidate
          if ($cu.Host -ne $domain) { continue }
          if ($cu.AbsolutePath -match '\.(jpg|jpeg|png|webp|avif|gif|svg|pdf|zip|xml|txt|js|css|json|woff2?)$') { continue }
          if (-not $known.Contains($candidate)) {
            $known.Add($candidate) | Out-Null
            $queue.Enqueue($candidate)
          }
        } catch {
        }
      }
    }
  } catch {
  }
}

$pages = $pages | Sort-Object url -Unique
$imageRows = $imageRows | Sort-Object sourcePageUrl,imageSrc -Unique

$pages | Export-Csv -Path 'seo_canonical_crawl_export.csv' -NoTypeInformation -Encoding UTF8
$pages | ConvertTo-Json -Depth 5 | Set-Content -Path 'seo_canonical_crawl_export.json' -Encoding UTF8
$imageRows | Export-Csv -Path 'seo_image_alt_inventory.csv' -NoTypeInformation -Encoding UTF8

$totalPages = $pages.Count
$totalImages = $imageRows.Count
$missingCanonical = @($pages | Where-Object { -not $_.canonical }).Count

$summary = @(
  '# Canonical Crawl Export Summary',
  '',
  "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')",
  "Pages crawled (status 200): $totalPages",
  "Image rows captured: $totalImages",
  "Pages missing canonical: $missingCanonical",
  "Crawl limit: $maxPages",
  '',
  'Files:',
  '- `seo_canonical_crawl_export.csv`',
  '- `seo_canonical_crawl_export.json`',
  '- `seo_image_alt_inventory.csv`'
)
$summary -join "`n" | Set-Content -Path 'seo_canonical_crawl_summary.md' -Encoding UTF8

Write-Output "Pages: $totalPages"
Write-Output "Images: $totalImages"
Write-Output "MissingCanonical: $missingCanonical"
($pages | Select-Object -First 10 url,pageType,title | ConvertTo-Json -Depth 4)
