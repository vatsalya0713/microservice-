# microservice-
🏗️ Microservices-Based Hotel Rating System This project is a microservices architecture demo built with Spring Boot and Spring Cloud. It showcases how different services communicate with each other using Service Discovery (Eureka Server) and API Gateway.


🔹 Microservices in the Project
User Service 👤
Manages user details (create, update, fetch users).
Interacts with the rating service to fetch user ratings.
Hotel Service 🏨
Handles hotel information (create, update, fetch hotels).
Provides hotel details to rating and user services.
Rating Service ⭐
Stores and manages ratings given by users to hotels.
Provides rating data to user and hotel services.



🔹 Supporting Components
Eureka Server (Service Registry)
All microservices register here.
Helps in service discovery without hardcoding service URLs.
API Gateway (Spring Cloud Gateway)
Single entry point for all microservices.

🔹 Tech Stack
Java 17+
Spring Boot
Spring Cloud (Eureka, API Gateway, OpenFeign)
Maven
REST APIs
