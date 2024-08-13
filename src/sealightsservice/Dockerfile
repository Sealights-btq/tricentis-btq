# Use a base image with Java installed
FROM eclipse-temurin:17 as builder

ARG SEALIGHTS_TOKEN
ARG BRANCH
ARG BUILD_NAME
ARG SERVICE_NAME=sealightsservice
ENV OS_ARCH linux-amd64

RUN apt-get update && apt-get install -y wget && apt-get install -y zip

WORKDIR /sealights
RUN wget -nv https://agents.sealights.co/sealights-java/sealights-java-latest.zip
# Use jar to extract the contents of instead of installing unzip
RUN unzip -oq sealights-java-latest.zip

WORKDIR /app
COPY . /app

COPY slConfig.json /app/slConfig.json

RUN echo ${SEALIGHTS_TOKEN}>token.txt

RUN ./mvnw clean package
RUN java -Dsl.enableUpgrade=false -Dsl.featuresData.enableLineCoverage=true -Dsl.featuresData.lineCoverageVersion=v2 -jar /sealights/sl-build-scanner-4.0.2506.jar -pom -configfile slConfig.json -workspacepath .

RUN java -Dsl.enableUpgrade=false -Dsl.featuresData.enableLineCoverage=true -Dsl.featuresData.lineCoverageVersion=v2 -jar /sealights/sl-build-scanner-4.0.2506.jar -config -token "${SEALIGHTS_TOKEN}" -appname "sealightservice" -branchname "${BRANCH}" -buildname "${BUILD_NAME}" -pi "sealights.notes.*" -pe "sealights.notes.sealights"
# Expose the port that your Spring Boot application listens on

FROM openjdk:17-alpine as runtime
COPY --from=builder /sealights/sl-test-listener.jar /sealights/sl-test-listener.jar
COPY --from=builder /app/buildSessionId.txt /sealights/buildSessionId.txt
WORKDIR /app
COPY --from=builder app/target/sealights-0.0.1-SNAPSHOT.jar /app/sealights-0.0.1-SNAPSHOT.jar
EXPOSE 5732

# Command to run the Spring Boot application when the container starts
CMD ["java", "-jar", "/app/sealights-0.0.1-SNAPSHOT.jar"]
