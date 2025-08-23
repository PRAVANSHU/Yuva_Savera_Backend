# Yuva Savera Backend API

This is the backend API for Yuva Savera - a social empowerment and youth engagement platform that connects Indian youth volunteers with people in need.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Volunteer Management**: Registration, profile management, and contribution tracking
- **Help Request System**: Create, manage, and match help requests with volunteers
- **Success Stories**: Share and showcase impact stories
- **Partner Integration**: Partner organization registration and collaboration
- **File Upload**: Support for images, videos, and documents
- **Real-time Notifications**: Email and SMS notifications
- **Geolocation**: Location-based matching and services
- **Analytics**: Impact tracking and reporting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with cloud storage integration
- **Email**: Nodemailer
- **Validation**: Joi and express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── volunteerController.js # Volunteer management
│   ├── requestController.js  # Help request management
│   ├── storyController.js    # Success stories
│   └── partnerController.js  # Partner organizations
├── models/
│   ├── User.js              # User schema
│   ├── Volunteer.js         # Volunteer schema
│   ├── HelpRequest.js       # Help request schema
│   ├── Story.js             # Success story schema
│   └── Partner.js           # Partner schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── volunteerRoutes.js   # Volunteer routes
│   ├── requestRoutes.js     # Help request routes
│   ├── storyRoutes.js       # Story routes
│   └── partnerRoutes.js     # Partner routes
├── middleware/
│   ├── authMiddleware.js    # Authentication middleware
│   └── errorMiddleware.js   # Error handling
├── utils/
│   └── fileUpload.js        # File upload utilities
├── server.js                # Main server file
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yuva-savera/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or configure MongoDB Atlas connection in .env
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PATCH /auth/update-password` - Update password

### Volunteer Endpoints
- `POST /volunteers/register` - Register as volunteer
- `GET /volunteers/profile/:id` - Get volunteer profile
- `PATCH /volunteers/profile/:id` - Update volunteer profile
- `GET /volunteers/dashboard` - Get volunteer dashboard
- `GET /volunteers/leaderboard` - Get volunteer leaderboard

### Help Request Endpoints
- `GET /requests` - Get all help requests (with filters)
- `POST /requests` - Create new help request
- `GET /requests/:id` - Get specific help request
- `PATCH /requests/:id/assign` - Assign volunteer to request
- `PATCH /requests/:id/status` - Update request status
- `GET /requests/stats` - Get request statistics

### Success Story Endpoints
- `GET /stories` - Get all success stories
- `POST /stories` - Create new success story
- `GET /stories/:id` - Get specific story
- `GET /stories/featured` - Get featured stories
- `PATCH /stories/:id` - Update story
- `DELETE /stories/:id` - Delete story

### Partner Endpoints
- `GET /partners` - Get all partners
- `POST /partners/register` - Register as partner
- `GET /partners/:id` - Get partner details
- `PATCH /partners/profile/:id` - Update partner profile
- `GET /partners/dashboard/:id` - Get partner dashboard

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Joi and express-validator
- **Password Hashing**: bcryptjs
- **JWT Security**: Secure token handling

## 📊 Database Schema

### User Model
- Basic user information
- Authentication data
- Role-based access control

### Volunteer Model
- Extended user profile for volunteers
- Skills and interests
- Points and badges system
- Contribution history

### HelpRequest Model
- Help request details
- Location and urgency
- Status tracking
- Volunteer assignment

### Story Model
- Success story content
- Media attachments
- Impact metrics
- Community engagement

### Partner Model
- Organization details
- Partnership management
- Collaboration tracking

## 🔧 Development

### Code Structure
- **Controllers**: Business logic
- **Models**: Database schemas
- **Routes**: API endpoints
- **Middleware**: Request processing
- **Utils**: Helper functions

### Error Handling
- Centralized error handling
- Custom error classes
- Environment-specific responses
- Logging and monitoring

### File Upload
- Multer configuration
- Cloud storage integration
- File type validation
- Size limits

## 🚀 Deployment

### Environment Variables
Set up the following environment variables:
- `NODE_ENV`: production
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `EMAIL_*`: Email configuration
- `CLOUDINARY_*`: Cloud storage configuration

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas
3. Set up cloud storage
4. Configure email service
5. Set up monitoring and logging

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 TODO Items

The following features are planned for implementation:

### Authentication
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login integration
- [ ] Two-factor authentication

### Core Features
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Geolocation services
- [ ] Payment integration
- [ ] Mobile app API support

### Admin Features
- [ ] Admin dashboard
- [ ] User management
- [ ] Content moderation
- [ ] Analytics and reporting

### Performance
- [ ] Caching implementation
- [ ] Database optimization
- [ ] API rate limiting
- [ ] Load balancing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: dev@yuvasavera.org
- Documentation: [API Docs](https://api.yuvasavera.org/docs)
- Issues: [GitHub Issues](https://github.com/yuva-savera/issues)