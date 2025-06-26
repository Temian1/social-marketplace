# WhatsApp Marketplace

A full-stack marketplace web application built with Next.js for buying and selling WhatsApp Groups and Channels. Features secure escrow system, user authentication, payment processing, and comprehensive admin panel.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with NextAuth.js
- **Marketplace**: Browse, search, and filter WhatsApp groups/channels
- **Escrow System**: Secure transactions with buyer protection
- **Wallet System**: Track deposits, purchases, and earnings
- **Referral Program**: Earn commissions from referred users
- **Reviews & Ratings**: Rate sellers and build trust
- **Real-time Chat**: Communicate with buyers/sellers
- **Admin Panel**: Comprehensive management dashboard

### User Features
- **Profile Management**: Create and customize user profiles
- **Listing Creation**: Sell your WhatsApp groups/channels
- **Advanced Search**: Filter by price, niche, type, and more
- **Transaction History**: Track all purchases and sales
- **Notification System**: Stay updated on important events
- **Responsive Design**: Works on mobile, tablet, and desktop

### Security & Performance
- **Secure Payments**: Flutterwave integration for payments
- **Data Protection**: Encrypted passwords and secure sessions
- **Rate Limiting**: Prevent spam and abuse
- **Image Optimization**: Fast loading with Next.js Image
- **SEO Optimized**: Meta tags and structured data

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication and session management
- **Neon Database** - Serverless PostgreSQL
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Hosting and deployment
- **Neon** - Database hosting
- **Cloudinary** - Image storage and optimization

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon Database account

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd whatsapp-marketplace
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Copy \`.env.example\` to \`.env.local\` and configure:
   \`\`\`env
   # Database
   DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Flutterwave (Optional for payments)
   FLUTTERWAVE_PUBLIC_KEY="your-public-key"
   FLUTTERWAVE_SECRET_KEY="your-secret-key"
   \`\`\`

4. **Database Setup**
   Run the SQL scripts in your Neon database console:
   - \`scripts/create-database.sql\` - Creates tables and indexes
   - \`scripts/init-settings.sql\` - Sets up default settings
   - \`scripts/seed-mock-data.sql\` - Adds sample data

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the Application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and profiles
- **listings** - WhatsApp groups/channels for sale
- **transactions** - Purchase records and escrow
- **wallets** - User balance tracking
- **referrals** - Referral program data
- **reviews** - User ratings and feedback
- **messages** - Chat between users
- **notifications** - System notifications
- **settings** - Platform configuration

### Key Relationships
- Users can have multiple listings
- Transactions link buyers, sellers, and listings
- Reviews are tied to completed transactions
- Messages belong to specific transactions
- Referrals track user relationships

## 🔐 Authentication

### Default Test Accounts
After running the seed script, you can use these accounts:

**Regular Users:**
- Email: \`john@example.com\` | Password: \`password\`
- Email: \`sarah@example.com\` | Password: \`password\`
- Email: \`mike@example.com\` | Password: \`password\`

**Admin Account:**
- Email: \`admin@whatsappmarket.com\` | Password: \`password\`

### Creating New Accounts
1. Visit \`/auth/signup\`
2. Fill in the registration form
3. Account is created instantly (email verification optional)

## 🏪 Using the Marketplace

### For Buyers
1. **Browse Listings**: Visit \`/marketplace\` to see available groups
2. **Search & Filter**: Use filters to find specific niches or price ranges
3. **View Details**: Click on listings to see full descriptions
4. **Make Purchase**: Buy through secure escrow system
5. **Leave Reviews**: Rate sellers after successful transactions

### For Sellers
1. **Create Listing**: Go to \`/listings/create\` (requires login)
2. **Add Details**: Title, description, price, screenshots
3. **Wait for Approval**: Admin reviews before going live
4. **Manage Sales**: Track purchases in dashboard
5. **Deliver Product**: Provide WhatsApp group/channel access

### For Admins
1. **Access Admin Panel**: Login with admin account
2. **Manage Users**: View, ban, or suspend accounts
3. **Review Listings**: Approve or reject new listings
4. **Handle Disputes**: Resolve transaction issues
5. **Monitor Platform**: View analytics and system health

## 🎨 Customization

### Theming
- Dark/Light mode toggle in navigation
- Customize colors in \`tailwind.config.ts\`
- Modify components in \`components/ui/\`

### Configuration
Platform settings stored in database \`settings\` table:
- Commission percentage (default: 10%)
- Minimum withdrawal amount
- Escrow auto-release days
- Feature toggles

### Adding Features
The modular architecture makes it easy to extend:
- Add new API routes in \`app/api/\`
- Create new pages in \`app/\`
- Build reusable components in \`components/\`

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add all \`.env\` variables in Vercel dashboard
3. **Database**: Ensure Neon database is accessible
4. **Deploy**: Automatic deployment on git push

### Environment Variables Required
- \`DATABASE_URL\` - Neon database connection
- \`NEXTAUTH_URL\` - Your domain URL
- \`NEXTAUTH_SECRET\` - Random secret key
- \`FLUTTERWAVE_PUBLIC_KEY\` - Payment processing
- \`FLUTTERWAVE_SECRET_KEY\` - Payment processing

## 📱 API Documentation

### Authentication Endpoints
- \`POST /api/auth/signin\` - User login
- \`POST /api/users/register\` - User registration

### Marketplace Endpoints
- \`GET /api/listings\` - Get listings with filters
- \`POST /api/listings\` - Create new listing
- \`GET /api/listings/[id]\` - Get specific listing

### User Endpoints
- \`GET /api/users/profile\` - Get user profile
- \`PUT /api/users/profile\` - Update profile
- \`GET /api/users/stats\` - Get user statistics

## 🔧 Development

### Project Structure
\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── marketplace/       # Marketplace pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── marketplace/      # Marketplace-specific
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database functions
│   └── utils.ts          # Helper functions
└── scripts/              # Database scripts
\`\`\`

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for consistent styling

### Testing
\`\`\`bash
npm run lint          # Run ESLint
npm run build         # Test production build
npm run start         # Test production server
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🔮 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced search with AI
- [ ] Subscription-based listings
- [ ] Bulk operations for admins
- [ ] API rate limiting dashboard
- [ ] Advanced notification system
- [ ] Integration with more payment providers

### Performance Improvements
- [ ] Redis caching layer
- [ ] CDN integration
- [ ] Database query optimization
- [ ] Image lazy loading
- [ ] Progressive Web App (PWA)

---

**Built with ❤️ using Next.js and modern web technologies**
