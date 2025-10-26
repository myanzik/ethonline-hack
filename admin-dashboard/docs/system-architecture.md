# System Architecture Diagrams

## 1. Overall System Architecture

```mermaid
graph TB
    A[Admin Dashboard] --> B[Merchant Management]
    A --> C[Beneficiary Management]
    A --> D[Channel Management]
    A --> E[Token Distribution]
    
    B --> F[Merchant Database]
    C --> G[Beneficiary Database]
    D --> H[Channel Database]
    E --> I[Token Database]
    
    F --> J[Merchant App]
    G --> K[Beneficiary App]
    H --> L[Transaction System]
    I --> L
    
    J --> M[Merchant Services]
    K --> N[Beneficiary Services]
    L --> O[Payment Processing]
```

## 2. Channel Creation Workflow

```mermaid
flowchart TD
    A[Admin Login] --> B[Select Merchants]
    B --> C[Select Beneficiaries]
    C --> D[Set Token Amount]
    D --> E[Calculate Distribution]
    E --> F[Create Channel]
    F --> G[Distribute Tokens]
    G --> H[Channel Active]
    
    E --> I[Total Tokens ÷ Beneficiaries]
    I --> J[Tokens per Beneficiary]
    J --> G
```

## 3. Token Distribution Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System
    participant B as Beneficiaries
    participant M as Merchants
    
    A->>S: Create Channel
    A->>S: Set Total Tokens (1000)
    A->>S: Select 5 Beneficiaries
    S->>S: Calculate: 1000 ÷ 5 = 200 each
    S->>B: Distribute 200 tokens each
    B->>M: Use tokens for transactions
    M->>S: Report transactions
    S->>A: Update dashboard
```

## 4. User Interaction Flow

```mermaid
graph LR
    A[Admin Dashboard] --> B[View Merchants]
    A --> C[View Beneficiaries]
    A --> D[View Channels]
    A --> E[Create Channel]
    
    B --> F[Search & Filter]
    C --> G[Search & Filter]
    D --> H[Channel Details]
    E --> I[Select Participants]
    I --> J[Set Token Amount]
    J --> K[Create & Distribute]
    
    F --> L[Merchant Details]
    G --> M[Beneficiary Details]
    H --> N[Transaction History]
```

## 5. Data Flow Architecture

```mermaid
graph TD
    A[Frontend - Next.js] --> B[API Layer]
    B --> C[Business Logic]
    C --> D[Data Access Layer]
    D --> E[Database]
    
    F[Admin Actions] --> A
    G[Merchant Actions] --> H[Merchant App]
    I[Beneficiary Actions] --> J[Beneficiary App]
    
    H --> B
    J --> B
    
    E --> K[Merchants Table]
    E --> L[Beneficiaries Table]
    E --> M[Channels Table]
    E --> N[Transactions Table]
```

## 6. Security Architecture

```mermaid
graph TB
    A[User Authentication] --> B[Role-Based Access]
    B --> C[Admin Access]
    B --> D[Merchant Access]
    B --> E[Beneficiary Access]
    
    C --> F[Full System Access]
    D --> G[Merchant Operations]
    E --> H[Token Usage]
    
    I[Data Encryption] --> J[Database]
    K[API Security] --> L[Request Validation]
    M[Token Security] --> N[Transaction Validation]
```

## 7. Deployment Architecture

```mermaid
graph TB
    A[Load Balancer] --> B[Web Server 1]
    A --> C[Web Server 2]
    A --> D[Web Server N]
    
    B --> E[Application Server]
    C --> E
    D --> E
    
    E --> F[Database Cluster]
    E --> G[Cache Layer]
    E --> H[File Storage]
    
    I[CDN] --> A
    J[Monitoring] --> E
    K[Backup System] --> F
```

## 8. Channel Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Planning: Admin starts
    Planning --> Configuration: Select participants
    Configuration --> Validation: Set token amount
    Validation --> Active: Channel created
    Active --> Monitoring: Tokens distributed
    Monitoring --> Active: Transactions ongoing
    Active --> Suspended: Admin suspends
    Suspended --> Active: Admin reactivates
    Active --> Closed: Program ends
    Closed --> [*]
```

## 9. Token Transaction Flow

```mermaid
sequenceDiagram
    participant B as Beneficiary
    participant M as Merchant
    participant S as System
    participant A as Admin
    
    B->>M: Request service/product
    M->>S: Validate token balance
    S->>M: Confirm sufficient tokens
    M->>S: Process transaction
    S->>B: Deduct tokens
    S->>M: Credit tokens
    S->>A: Log transaction
    M->>B: Provide service/product
```

## 10. System Components Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Admin Dashboard]
        B[Merchant Interface]
        C[Beneficiary Interface]
    end
    
    subgraph "Application Layer"
        D[Channel Management]
        E[Token Distribution]
        F[User Management]
        G[Transaction Processing]
    end
    
    subgraph "Data Layer"
        H[User Database]
        I[Channel Database]
        J[Transaction Database]
        K[Token Database]
    end
    
    subgraph "External Services"
        L[Payment Gateway]
        M[Notification Service]
        N[Reporting Service]
    end
    
    A --> D
    B --> G
    C --> G
    D --> I
    E --> K
    F --> H
    G --> J
    G --> L
    D --> M
    E --> N
```

These diagrams provide a comprehensive visual representation of the Token Distribution Channel Management System, showing the architecture, workflows, and interactions between different components.
