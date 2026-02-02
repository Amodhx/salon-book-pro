# Salon Booking API - Spring Boot Backend

A complete RESTful API backend for the Salon Appointment Booking System built with **Spring Boot 3.2.x** and **JDK 17**.

## 📋 Prerequisites

- **JDK 17** or higher
- **Maven 3.8+** or use the included Maven wrapper
- (Optional) PostgreSQL for production

## 🚀 Quick Start

### 1. Clone/Copy the backend folder

```bash
cd spring-boot-backend
```

### 2. Run with Maven

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or with installed Maven
mvn spring-boot:run
```

### 3. Access the application

- **API Base URL**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:salondb`)

## 📁 Project Structure

```
src/main/java/com/salon/
├── SalonBookingApplication.java    # Main entry point
├── config/
│   ├── CorsConfig.java             # CORS configuration
│   ├── SecurityConfig.java         # Spring Security setup
│   ├── OpenApiConfig.java          # Swagger/OpenAPI config
│   └── DataLoader.java             # Initial data seeding
├── controller/
│   ├── ServiceController.java      # /api/services endpoints
│   ├── AvailabilityController.java # /api/availability endpoints
│   ├── BookingController.java      # /api/bookings endpoints
│   └── FileController.java         # /api/files endpoints
├── dto/
│   ├── ApiResponse.java            # Standard response wrapper
│   ├── ServiceDTO.java             # Service DTOs
│   ├── AvailabilityDTO.java        # Availability DTOs
│   └── BookingDTO.java             # Booking DTOs
├── entity/
│   ├── Gender.java                 # Gender enum
│   ├── BookingStatus.java          # Status enum
│   ├── AvailabilityType.java       # Availability type enum
│   ├── Service.java                # Service entity
│   ├── TimeSlot.java               # Time slot entity
│   ├── AvailabilityRange.java      # Availability range entity
│   └── Booking.java                # Booking entity
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── ServiceRepository.java
│   ├── AvailabilityRangeRepository.java
│   ├── TimeSlotRepository.java
│   └── BookingRepository.java
└── service/
    ├── SalonService.java           # Service business logic
    ├── AvailabilityService.java    # Availability business logic
    ├── BookingService.java         # Booking business logic
    └── FileStorageService.java     # File upload handling
```

## 🔌 API Endpoints

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| GET | `/api/services/{id}` | Get service by ID |
| GET | `/api/services/gender/{MEN\|WOMEN}` | Get services by gender |
| POST | `/api/services` | Create new service |
| PUT | `/api/services/{id}` | Update service |
| DELETE | `/api/services/{id}` | Delete service |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability` | Get all availability ranges |
| GET | `/api/availability/upcoming` | Get upcoming ranges |
| GET | `/api/availability/{id}` | Get range by ID |
| GET | `/api/availability/slots?date=YYYY-MM-DD` | Get available slots for date |
| POST | `/api/availability` | Create availability range |
| PUT | `/api/availability/{id}` | Update range |
| DELETE | `/api/availability/{id}` | Delete range |
| PATCH | `/api/availability/slots/{slotId}?isAvailable=true` | Update slot |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| GET | `/api/bookings/status/{PENDING\|APPROVED\|REJECTED}` | Get by status |
| GET | `/api/bookings/summary` | Get booking statistics |
| POST | `/api/bookings` | Create new booking |
| PATCH | `/api/bookings/{id}/status` | Update booking status |
| DELETE | `/api/bookings/{id}` | Delete booking |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload payment slip |
| GET | `/api/files/{filename}` | Get uploaded file |
| DELETE | `/api/files/{filename}` | Delete file |

## 📝 Example Requests

### Create a Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "+1234567890",
    "serviceId": "service-uuid-here",
    "gender": "MEN",
    "bookingDate": "2025-02-10",
    "timeSlot": "10:00:00",
    "notes": "First time customer"
  }'
```

### Create Availability Range
```bash
curl -X POST http://localhost:8080/api/availability \
  -H "Content-Type: application/json" \
  -d '{
    "type": "WEEKLY",
    "startDate": "2025-02-10",
    "endDate": "2025-02-16",
    "startTime": "09:00:00",
    "endTime": "19:00:00"
  }'
```

### Update Booking Status
```bash
curl -X PATCH http://localhost:8080/api/bookings/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'
```

## ⚙️ Configuration

### Switch to PostgreSQL (Production)

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/salon_db
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### CORS Configuration

Update allowed origins in `application.yml`:

```yaml
cors:
  allowed-origins: http://localhost:5173,https://your-frontend-domain.com
```

## 🔐 Security Notes

The current configuration allows all endpoints for development. For production:

1. Implement JWT authentication
2. Protect admin endpoints
3. Add rate limiting
4. Enable HTTPS
5. Update CORS origins

## 🧪 Testing

```bash
# Run tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report
```

## 📦 Build for Production

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR
java -jar target/salon-booking-api-1.0.0.jar
```

## 🐳 Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/salon-booking-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:

```bash
docker build -t salon-api .
docker run -p 8080:8080 salon-api
```

## 📄 License

MIT License
