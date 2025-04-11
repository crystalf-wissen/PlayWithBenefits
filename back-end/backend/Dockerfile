FROM maven:3.9.6-eclipse-temurin-17 AS build
 
WORKDIR /app
 
COPY backend/back-end/pom.xml .

COPY backend/back-end/.mvn .mvn

COPY backend/back-end/mvnw .

COPY backend/back-end/src ./src
 
RUN chmod +x mvnw
 
RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jdk-slim
 
WORKDIR /app
 
COPY --from=build /app/target/*.jar app.jar
 
EXPOSE 8080
 
CMD ["java", "-jar", "app.jar"]

 