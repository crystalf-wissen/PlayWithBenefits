FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Only copy what's directly in the current directory (where Dockerfile is)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src ./src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
