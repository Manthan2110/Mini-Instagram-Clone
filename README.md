# 📸 Mini Instagram Clone

### Modern Social Media Web App built with HTML, CSS, JavaScript & jQuery

A **modern Instagram-style social media web application** that allows users to register, login, create posts, interact with content, and manage profiles — all powered by a **LocalStorage-based database system**.

This project demonstrates **real-world frontend engineering skills**, including **session management, dynamic rendering, UI architecture, and modular design.**

---

## 🌐 Live Demo

*(Enable GitHub Pages to see live project)*

```
https://manthan2110.github.io/Mini-Instagram-Clone/
```

---

## 🚀 Project Highlights

-  Modern Dark UI Design
- Real Login System
- Session Management
- Dynamic Feed Rendering
- Post Creation System
- Profile Management
- Like & Comment System
- Save Posts Feature
- Follow Button UI
- Responsive Layout
- Modal-based Interactions
- Clean Code Architecture

---

## 🧠 System Architecture

This project simulates a **real social media platform architecture** using **LocalStorage as a database**.

### Storage Structure

#### Users Table

```javascript
users[]
```

Example:

```javascript
{
 name: "Manthan Jadav",
 username: "manthan.py",
 email: "example@gmail.com",
 bio: "AI Developer"
}
```

---

#### Posts Table

```javascript
posts[]
```

Example:

```javascript
{
 id: "p1",
 user: {
   username: "manthan.py",
   displayName: "Manthan Jadav"
 },
 title: "My First Post",
 description: "Hello Instagram",
 image: "images/post.jpg",
 likes: 0,
 liked_by: [],
 saved_by: [],
 comments: [],
 created_at: 171000000
}
```

---

## 🧩 Features

### 🔐 Authentication System

* User Registration
* Login Validation
* Session Storage
* Secure Session Checking
* Auto Redirect if Logged Out

---

### 🏠 Feed System

* Dynamic post rendering
* Sorted by newest posts
* Like system
* Comment system
* Save posts
* Share button
* Follow button UI
* Refresh feed button

---

### 👤 Profile System

* User profile page
* Profile statistics
* Post gallery
* Edit profile
* Delete profile
* Profile avatar system

---

### ➕ Post Creation

* Image upload preview
* Post title
* Post description
* Publish system
* Instant feed update

---

## 🎨 UI Design

Modern design principles used:

* Dark Professional Theme
* Gradient UI Elements
* Glassmorphism Cards
* Smooth Hover Effects
* Animated Sidebar
* Responsive Layout

---

## 🛠 Technologies Used

| Technology   | Purpose          |
| ------------ | ---------------- |
| HTML5        | Structure        |
| CSS3         | Styling          |
| Bootstrap 5  | Layout           |
| JavaScript   | Logic            |
| jQuery       | DOM Manipulation |
| LocalStorage | Database         |

---

## 📂 Project Structure

```
Mini-Instagram-Clone/
│
├── feed.html
├── login.html
├── register.html
├── profile.html
├── create.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│
└── README.md
```

---

## 🔄 Application Flow

### User Journey

```
Register → Login → Feed → Create Post → Profile → Logout
```

---

### Login Flow

```
Login
 ↓
Validate Credentials
 ↓
Create Session
 ↓
Redirect Feed
```

---

### Post Flow

```
Create Post
 ↓
Store in LocalStorage
 ↓
Render Feed
```

---

## 🔐 Session Security

Session validation is implemented across all protected pages.

If session is invalid:

```
Redirect → login.html
```

---

## 📊 Key Engineering Concepts Demonstrated

This project demonstrates:

- ✔ State Management
- ✔ Client-side Authentication
- ✔ Data Modeling
- ✔ Dynamic Rendering
- ✔ UI Engineering
- ✔ Event-driven Programming
- ✔ Modular Design
- ✔ DOM Architecture

---

## 💡 Why This Project Stands Out

Unlike basic frontend projects, this application includes:

* Real Authentication Logic
* Data Persistence
* Multi-page Architecture
* Session Security
* Structured Database Model
* Professional UI System

This project simulates a **real-world social media application workflow.**

---

## 📈 Future Improvements

* Real Backend (Node.js / Django)
* Database Integration
* Image Storage
* Messaging System
* Notifications
* Real Follow System
* API Integration

---

## 👨‍💻 Author

**Manthan Jadav**

Machine Learning Developer | Data Analyst | Software Engineer

Skills:

* Python
* Machine Learning
* SQL
* Power BI
* JavaScript
* Streamlit

---

## ⭐ Project Status

```
Completed ✔
Production Ready ✔
Portfolio Ready ✔
```

---

## 🏆 Achievement

This project demonstrates the ability to build a **full-featured web application without a backend**, simulating real-world product behavior.

---

## 📜 License

Free to use for learning purposes.

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub.
