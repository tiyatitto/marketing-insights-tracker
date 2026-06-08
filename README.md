# Marketing Insights Tracker

A comprehensive marketing activity management and reporting platform built using Next.js, TypeScript, Tailwind CSS, and Firebase.

The system helps organizations manage marketing visits, institutional outreach, hospital engagement, activity reporting, expense tracking, and performance monitoring through role-based dashboards for Admins and Staff.

---

## Features

### Staff Dashboard
- Create and manage marketing reports
- Organization profile management
- Institution and Hospital profile creation
- Auto-fill organization details during report creation
- View organization-wise reports
- Expense tracking and report submission

### Admin Dashboard
- Monitor staff activities
- Review submitted reports
- Expense analytics and tracking
- Monthly Target vs Achievement monitoring
- Institution and Hospital visit tracking
- Organization-wise reporting insights

### Organization Profile Management
- Create Institution Profiles
- Create Hospital Profiles
- Auto-save organization details
- Reuse profiles across reports
- Prevent duplicate organization entries
- View reports associated with each organization

### Report Management
- Meeting with Organization
- Marketing Activities
- Participation in Conferences
- Follow-up with Institutions
- Organization-linked reports
- Search and filter reports

### Expense Tracker
- Expense monitoring by report
- Organization-wise expense tracking
- Staff-wise expense tracking
- Filtered expense summaries
- Detailed report information display
- Total expense calculations

### Target vs Achievement Tracking
- Monthly target setting
- Institution visit tracking
- Hospital visit tracking
- Editable monthly targets
- Automatic achievement calculation
- Current month highlighting

---

## Tech Stack

### Frontend
- Next.js 15
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend & Database
- Firebase Authentication
- Cloud Firestore

### Form Handling & Validation
- React Hook Form
- Zod

---

## Project Structure

```bash
app/
components/
lib/
public/

app/
├── admin/
├── staff/
├── login/
└── api/

components/
├── analytics/
├── staff/
├── admin/
└── ui/

lib/
├── firebase.ts
├── schemas.ts
└── utils.ts
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/tiyatitto/marketing-insights-tracker.git
```

Navigate to the project:

```bash
cd marketing-insights-tracker
```

Install dependencies:

```bash
npm install
```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Firebase Configuration

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Future Enhancements

- Advanced analytics dashboard
- Organization performance insights
- Export reports to PDF/Excel
- Email notifications
- Role-based approval workflows
- Advanced target management

---

## Author

Tiya Titto

B.Tech Computer Science (Data Science)
MACE Kothamangalam

---

## License

This project is developed for academic and learning purposes.