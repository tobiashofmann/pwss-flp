# Password Self Service Reset Fiori Launchpad Plugin

## Overview requirements

The functional and non-functional requirements are listed in the following mindmap.

```mermaid
mindmap
root((Passwort reset))
    General
        Self service
        No training
        Error prone
        Low maintenance effort
    Users
        Developers need to reset password
            Password not known
            Logon in ADT needs password
        SSO to S4 enabled
    Security
        No user sharing
        No clear text of PW communication
        Access in nonPRD systems
        Token only
        User requirements
            SSO needed
            EMail needed
    Technology
        Frontend
            Fiori Launchpad Plugin
            Web based with Fiori and UI5
        Backend
            S4
            ABAP
        Closed system, all in place in S4
        Code in GitLab
        Deploy in several systems
        Transport via SolMan
```



## State

Throught the usage of the app, several possible states can occur. Depending on what the user decides, the password gets resetted or not.

```mermaid
stateDiagram-v2
state "New password needed" as s1
state "Password requested via FLP" as s2
state "E-Mail with token received" as s3
state "Link called to generate new password" as s4
state "New password in backend generated" as s5
state "New password active" as s6
state "User copies new password from website" as s7
state "User stops process" as end1
state "Old password active" as end2
[*] --> s1
s1 --> s2: Browser
s2 --> end1
s2 --> s3: E-Mail
s3 --> end1
s3 --> s4: Browser
s4 --> s5
s5 --> s6
s6 --> s7: Browser 
s7 --> [*]
end1 --> end2
end2 --> [*]
```

## Components

The main components of the solutions are:

Backend: 
* S/4HANA ABAP
* Internal tables for token and user storage
* ICF nodes for communication

Frontend:
* FLP with plugin
* Confirmation page with new password

## Sequence diagram

The process is always triggered by the user. The FLP plugin is taking care of the steps outline in #1 and #2.

```mermaid
sequenceDiagram
    actor User
    autonumber
    User->>+FLP: Start new password request

    FLP->>+SAP: Call ICF service
    Note over FLP,SAP: SSO
    critical 
    SAP->>SAP: Validate user data
    SAP->>SAP: Generate token
    SAP->>SAP: Save token (MD5) and timestamp in table
    SAP->>SAP: Prepare E-Mail
    SAP->>-E-Mail: Send E-Mail
    end

    E-Mail->>+User: Send E-Mail with token
    activate User
    User->>+SAP: Open Link, Confirm request
    deactivate User
    Note over User,SAP: Technical user

    critical 
    SAP->>SAP: Validate timestamp and token
    SAP->>SAP: Reset password
    SAP->>SAP: Clear table
    end
    SAP-->>-User: Show success message
    User->>User: Copy password
```

