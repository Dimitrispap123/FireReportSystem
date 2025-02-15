# 🔥 Fire Incident Reporting & Volunteer Management System

## 📖 About the Project
This web application allows users to:
- **Report fire-related incidents** and track them on a **live map**.
- **Register as users** for incident updates or **volunteer firefighters** who can assist in emergencies.
- **Login as an admin** to **manage incidents, approve volunteers, and monitor participation**.

The system supports **different user roles**, each with specific permissions and actions.

---

## 👥 User Roles & Features

### 🔹 **Admin**
- Can **create, modify, and track** active incidents on the map.
- **View volunteer applications** and approve/reject participation.
- Receives **instant notifications** when volunteers apply for incidents.
- Can **comment on volunteer performance** after an incident.
- Can **read public messages** and **private messages sent to them**.

### 🔹 **Volunteer Firefighter**
- Can **register and update their profile**.
- Can **report incidents** and **view active incidents on the map**.
- Can **apply to join active incidents**.
- Receives **notifications** when incidents need assistance.
- Can **read public and private messages**.
- Can **track their participation history**.

### 🔹 **Regular User**
- Can **register and update their profile**.
- Can **report incidents** and **view active incidents on the map**.
- Receives **real-time notifications** for incidents in their area.
- Can **read public and private messages**.

### 🔹 **Guest User**
- Can access the system **without registration**, using only their phone number.
- Can **report incidents** and **view active incidents on the map**.

---

## 🔧 Technologies Used
- **Backend:** JSP, Servlets (Java)
- **Frontend:** HTML, CSS, JavaScript, OpenLayers
- **Database:** MySQL (Managed via XAMPP)
- **Server:** Apache Tomcat
- **Version Control:** Git, GitHub

---

## 📌 Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/Dimitrispap123/FireReportSystem.git
