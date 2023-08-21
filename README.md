# Ticketing App - Microservices-based Application

Welcome to the Ticketing App repository! This project is a microservices-based application designed to facilitate the buying and selling of tickets on its platform. The application is comprised of several services, each serving a specific purpose in the ticketing process. The services are containerized and orchestrated using Kubernetes, and communication between them is achieved through a stream of events provided by the NATS Streaming Server message queue system.

## Services Overview

1. **Auth Service**: Responsible for handling user authentication. Users are able to securely register, log in, and manage their accounts using this service.

2. **Tickets Service**: This service allows users to create new tickets for events. Ticket details such as event information, price, and availability are managed within this service.

3. **Orders Service**: Manages the recording of orders placed by users. It handles the process of purchasing tickets, keeping track of the ordered tickets and their associated details.

4. **Payment Service**: Handles all payment-related processes for the reserved tickets. Once a user places an order, this service processes the payment and confirms the transaction.

5. **Expiration Service**: Implements a mechanism where a ticket is locked for a specific period (1 minute) when a user intends to buy it. During this time, the ticket owner cannot edit the ticket, and other users cannot concurrently purchase the same ticket.

## Technologies Used

- **Containerization**: Each service is containerized, allowing for consistent deployment and scalability across various environments.

- **Kubernetes**: The services are orchestrated using Kubernetes, which ensures efficient resource allocation, scaling, and fault tolerance.

- **Ingress-Nginx**: Ingress-Nginx acts as the load balancer, directing incoming traffic to the appropriate services.

- **NATS Streaming Server**: NATS Streaming Server provides the underlying messaging infrastructure for the stream of events that allow communication between services.

Thank you for your interest in the Ticketing App! We hope you find this microservices-based application informative and useful for understanding the architecture and technologies involved. If you have any further questions or need assistance, please don't hesitate to reach out.
