# 로컬에서 Docker 이미지 빌드 후 tar로 내보내기
# 사용: .\scripts\build-and-export.ps1

$ErrorActionPreference = "Stop"

Write-Host "1. 로컬에서 npm run build 확인 중..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "빌드 실패. 먼저 오류를 수정하세요." -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Docker 이미지 빌드 중..." -ForegroundColor Cyan
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^NEXT_PUBLIC_SUPABASE_URL=(.+)$") {
            $env:NEXT_PUBLIC_SUPABASE_URL = $Matches[1].Trim()
        }
    }
}
docker build --build-arg NEXT_PUBLIC_SUPABASE_URL="$env:NEXT_PUBLIC_SUPABASE_URL" -t study-mate .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker 빌드 실패." -ForegroundColor Red
    exit 1
}

Write-Host "`n3. 이미지를 tar 파일로 저장 중..." -ForegroundColor Cyan
docker save study-mate -o study-mate.tar
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n완료! study-mate.tar 생성됨" -ForegroundColor Green
} else {
    Write-Host "저장 실패." -ForegroundColor Red
    exit 1
}

Write-Host "`nEC2로 전송:" -ForegroundColor Yellow
Write-Host "  scp -i `"your-key.pem`" study-mate.tar ubuntu@EC2-IP:~/study-mate/" -ForegroundColor White
Write-Host "`nEC2에서 실행:" -ForegroundColor Yellow
Write-Host "  cd ~/study-mate" -ForegroundColor White
Write-Host "  docker load < study-mate.tar" -ForegroundColor White
Write-Host "  docker compose -f docker-compose.image.yml up -d" -ForegroundColor White
