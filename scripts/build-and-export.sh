#!/bin/bash
# 로컬에서 Docker 이미지 빌드 후 tar로 내보내기
# 사용: chmod +x scripts/build-and-export.sh && ./scripts/build-and-export.sh

set -e

echo "1. 로컬에서 npm run build 확인 중..."
npm run build

echo ""
echo "2. Docker 이미지 빌드 중..."
source .env 2>/dev/null || true
docker build --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" -t study-mate .

echo ""
echo "3. 이미지를 tar 파일로 저장 중..."
if command -v gzip &> /dev/null; then
  docker save study-mate | gzip > study-mate.tar.gz
  TAR_FILE="study-mate.tar.gz"
else
  docker save study-mate -o study-mate.tar
  TAR_FILE="study-mate.tar"
fi

echo ""
echo "완료! $TAR_FILE 생성됨"
echo ""
echo "EC2로 전송:"
echo "  scp -i \"your-key.pem\" $TAR_FILE ubuntu@EC2-IP:~/study-mate/"
echo ""
echo "EC2에서 실행:"
echo "  cd ~/study-mate"
echo "  docker load < $TAR_FILE"
echo "  docker compose -f docker-compose.image.yml up -d"
