# PetPaw Admin Hub

Design and build a fully functional, production-quality working prototype of a modern Admin Dashboard for a Pet Care Services Platform. The prototype should include realistic navigation, connected pages, sample data, CRUD interactions, validation, search, filters, pagination, modals, and responsive layouts. The focus is on demonstrating the complete workflow and user experience rather than backend implementation.

The platform connects Pet Owners with Pet Sitters who provide services such as Dog Walking, Boarding, Grooming, House Sitting, Check-in Visits, and Vet Runs.

The admin dashboard should look and behave like a professional SaaS administration panel with a clean, modern UI.

Design Requirements

Create a premium admin interface with:

Responsive desktop-first layout

Collapsible left sidebar

Top navigation bar

Dashboard cards

Interactive charts

Modern tables

Search

Filters

Sorting

Pagination

Modal dialogs

Toast notifications

Confirmation dialogs

Empty states

Loading skeletons

Error states

Breadcrumb navigation

Consistent spacing and typography

Light and Dark mode

Reusable UI components

Authentication Module

Create a complete authentication flow.

Login

Email

Password

Remember Me

Show/Hide Password

Forgot Password

Sign In

Forgot Password

Enter email

Send reset link

Success confirmation

Reset Password

New Password

Confirm Password

Password validation

Session Management

Logout

Protected routes

Session persistence

Unauthorized access handling

Dashboard

Create an analytics dashboard displaying:

Total Users

Total Pet Owners

Total Pet Sitters

Active Users

Total Bookings

Today's Bookings

Pending Bookings

Completed Bookings

Cancelled Bookings

Monthly Revenue

Total Revenue

Average Rating

Top Services

Most Active Sitters

Recent Registrations

Recent Bookings

Recent Reviews

Include:

Revenue chart

Booking trends

User growth

Booking status chart

Service popularity chart

Booking Management

Display all bookings.

Booking statuses:

Pending

Accepted

Confirmed

In Progress

Completed

Cancelled

Each booking should display:

Booking ID

Service

Pet Owner

Pet Sitter

Pet Names

Date

Time

Amount

Status

Payment Status

Features:

View Details

Search

Filters

Sort

Pagination

Status update

Booking timeline

Booking notes

Export bookings

User Management

Manage all platform users.

Separate tabs:

Pet Owners

Pet Sitters

Display:

Name

Email

Phone

Join Date

Status

Total Bookings

Rating

Last Active

Actions:

View Profile

Edit User

Suspend

Activate

Delete

View Activity

View Booking History

Pet Sitter Management

Provide additional management features.

Display:

Services Offered

Pricing

Availability

Experience

Total Jobs

Completed Jobs

Rating

Actions:

Verify Account

Suspend

Remove

View Reviews

View Bookings

Payments

Display all platform transactions.

Columns:

Transaction ID

Booking

Customer

Sitter

Service

Amount

Payment Method

Date

Status

Features:

Search

Filters

Export

Transaction Details

Reviews

Display all reviews.

Include:

Reviewer

Review Receiver

Service

Rating

Images

Comment

Date

Admin actions:

View

Delete

Hide

Restore

Community Moderation

Manage community discussions.

Features:

View discussions

Search posts

Delete posts

Remove comments

Hide inappropriate content

Suspend abusive users

Report management

Support Center

Display all support conversations.

Features:

Ticket List

Search

Filters

Open Ticket

Respond

Close Ticket

Ticket Status

Priority

CMS

Create a content management module.

Editable pages:

Privacy Policy

Terms & Conditions

About Us

FAQs

Contact Information

Use a rich text editor.

Notification Center

Manage platform notifications.

Features:

Send announcement

Broadcast notification

View notification history

Settings

Create a settings module.

Include:

General

Platform Name

Logo

Contact Email

Contact Number

Platform Settings

Booking Settings

Review Settings

Community Settings

Search

Every listing page should include:

Global Search

Filters

Sort

Pagination

Tables

Every data table should support:

Row selection

Bulk actions

Export

Search

Filters

Pagination

Sample Data

Populate every module with realistic mock data.

Include:

Users

Sitters

Pets

Services

Payments

Bookings

Reviews

Support Tickets

Community Posts

The dashboard should feel like a live production application.

Navigation

Sidebar navigation should include:

Dashboard

Bookings

Users

Pet Sitters

Payments

Reviews

Community

Support

Notifications

CMS

Settings

Logout

UX Requirements

Provide a polished user experience with:

Smooth page transitions

Loading indicators

Success messages

Validation messages

Responsive layouts

Accessible components

Consistent design system

Prototype Requirements

This should be a working interactive prototype, not static mockups.

Requirements:

Fully clickable navigation

Connected pages

Working forms with validation

Interactive tables

Functional search and filters using mock data

Working CRUD operations using local state/mock data

Dashboard charts populated with realistic data

Modal dialogs for create, edit, and delete actions

Confirmation dialogs for destructive actions

Responsive behavior across desktop, tablet, and mobile

Generate clean, reusable, scalable code with a modern SaaS dashboard aesthetic suitable for future integration with a real backend API.

Branding & Design Reference

Below is the screen shots  of the application's branding, including colors, typography, logo, icons, spacing, and overall visual style.

Use these screenshots as the primary design reference for the entire admin dashboard. Match the branding as closely as possible while maintaining a modern, clean, and professional SaaS dashboard experience.

Ensure the following align with the provided branding:

 Color palette (primary, secondary, accent, success, warning, error, and neutral colors)

 Typography and font hierarchy

 Button styles

 Form controls

 Cards and containers

 Icons and icon style

 Navigation (sidebar and top bar)

 Tables and data grids

 Charts and analytics widgets

 Modals and dialogs

 Notifications and badges

 Overall spacing, border radius, shadows, and UI consistency

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://best-bud-backend.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c4e04f1-6f1a-44dd-af30-62f23c2bb462).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
