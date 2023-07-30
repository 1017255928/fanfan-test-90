FROM openjdk:11-jdk-slim
WORKDIR /home/app
COPY target/springboot-sqlite-0.0.1-SNAPSHOT.jar /home/app/app.jar
COPY book_db.db /home/book_db.db
EXPOSE 8080
ENTRYPOINT ["java","-jar","/home/app/app.jar"]
