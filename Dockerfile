# Java 17이 설치된 실행 환경을 사용
FROM eclipse-temurin:17-jre

# 컨테이너 안에서 작업 폴더를 /app으로 잡는다
WORKDIR /app

# 로컬의 이 파일: target/reservation-0.0.1-SNAPSHOT.jar 을 
# Docker 이미지 안에: /app/app.jar 라는 이름으로 복사
COPY target/reservation-0.0.1-SNAPSHOT.jar app.jar

# 이 컨테이너는 8095 포트를 쓴다고 표시
EXPOSE 8095

# 컨테이너가 실행될 때 아래 명령을 실행한다
ENTRYPOINT ["java", "-jar", "app.jar"]