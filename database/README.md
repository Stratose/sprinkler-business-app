# Database Directory

This directory contains all database-related files for the sprinkler business app.

## 📁 Directory Structure

```
database/
├── schema.sql              # Main database schema
├── migrations/             # Future database migrations
├── seeds/                  # Future seed data
└── README.md               # This file
```

## 🗄️ Database Schema

### Tables

- **customers**: Customer information and contact details
- **customer_notes**: Notes and comments about customers
- **appointments**: Scheduled appointments and service calls
- **media_files**: File attachments and photos

### Current Schema (schema.sql)

The main database schema includes:

- Primary tables with relationships
- Row Level Security (RLS) policies
- Indexes for performance
- Proper foreign key constraints

## 🔧 Database Technology

- **Platform**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Security**: Row Level Security (RLS) policies
- **Project URL**: https://lhrzcnovizsjdmlaphcy.supabase.co

## 🚀 Future Expansion

This directory is prepared for:

- **migrations/**: Database schema changes over time
- **seeds/**: Sample data for development/testing
- **procedures/**: Stored procedures and functions
- **views/**: Database views for complex queries
- **triggers/**: Database triggers for automation

## 📝 Making Schema Changes

1. **For new features**: Add to schema.sql
2. **For changes**: Create migration files in migrations/
3. **For testing**: Add seed data in seeds/
4. **Update documentation**: Update this README

## 🔒 Security Notes

- All tables have RLS policies enabled
- Authentication required for all operations
- User-based data isolation
- Secure API key management

## 📊 Performance Considerations

- Indexes on frequently queried columns
- Proper foreign key relationships
- Optimized for single-user operations
- Prepared for future scaling needs
