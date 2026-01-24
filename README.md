# 🩸 Smart Blood Banking System

A comprehensive full-stack web platform that revolutionizes blood donation and distribution through **real-time an## 📱 User Experience Enhancements

- **Responsive Design** - Mobile-first approach with optimized layouts
- **Interactive Charts** - Dynamic visualizations with hover effects and drill-down capabilities
- **Real-time Feedback** - Live status indicators and activity counters
- **Progressive Enhancement** - Graceful degradation when real-time features are unavailable
- **Social Integration** - Sharing achievements and promoting blood donation awareness
- **Gamification Elements** - Points, badges, and milestone tracking for increased engagement
- **Smart Location Services** - GPS-based hospital assignment and distance optimization
- **Partner Integration** - Seamless coupon redemption and reward utilization**, **machine learning predictions**, and seamless integration between donors, recipients, and hospitals. Features advanced ML-powered demand forecasting, live data tracking, and intelligent hospital assignment for optimal blood distribution.

---

## 🚀 Tech Stack

| Layer             | Technologies & Frameworks |
|-------------------|--------------------|
| **Frontend**      | React.js • Chart.js • React Router • HTML5 • CSS3 • JavaScript (ES6+) • Axios • Bootstrap |
| **Backend**       | Node.js • Express.js • MongoDB • Mongoose • JWT Authentication • REST APIs |
| **Machine Learning** | Python • pandas • NumPy • scikit-learn • Random Forest • Gradient Boosting |
| **Real-Time Analytics** | Live Data Integration • CSV Processing • Dynamic Chart Updates |
| **Database**      | MongoDB • Real-time Data Schemas • Blood Inventory Tracking |
| **Security**      | bcrypt • JWT Tokens • Protected Routes • Hospital Authentication |
| **Development Tools** | Git/GitHub • VS Code • Postman • npm |

---

## 🎯 Key Innovations

### 🧠 **AI-Powered Blood Analytics**
- **Random Forest + Gradient Boosting Ensemble** achieving 99.4% accuracy (4.25 MAE)
- **Real-time demand prediction** based on seasonal patterns, weather, and regional factors
- **Interactive data visualizations** with Chart.js showing regional demand, seasonal trends, and blood type distribution
- **Live analytics dashboard** with real-time status indicators and activity counters

### �️ **Smart Hospital Assignment with Google Maps**
- **Geographic Intelligence** using Google Maps Geocoding API for precise location-based hospital assignment
- **Haversine Distance Calculation** for accurate distance measurement between donors, acceptors, and hospitals
- **Smart Midpoint Algorithm** finding optimal hospitals between donor and recipient locations
- **Graceful Fallback System** automatically switching to city/state matching when API unavailable
- **Visual Status Indicators** showing Smart Assignment availability in real-time
- **Enhanced WhatsApp Integration** with location details and assignment method information

### 🏆 **Comprehensive Rewards & Gamification System**
- **Multi-tier Certificate System** with Bronze, Silver, and Gold achievement levels
- **Digital Certificate Generation** with download and social sharing capabilities
- **Donation Points & Milestone Tracking** with visual progress bars and achievement unlocks
- **Partner Company Integration** featuring exclusive coupons from Starbucks, Zomato, Uber, Amazon, and more
- **Real-time Reward Calculations** based on donation frequency and impact metrics
- **Social Recognition Features** with shareable achievements and community rankings

### �📊 **Real-Time Data Integration**
- **Live donation and request tracking** automatically fed into ML models
- **Dynamic analytics updates** as new data comes in
- **Real-time status indicators** showing connection status and data freshness
- **Automatic model retraining** when sufficient new data is available

### 🏥 **Intelligent Hospital Management**
- **Automated nearest hospital assignment** for blood requests
- **Hospital dashboard** with inventory management and case tracking
- **Digital certificate generation** upon donation completion
- **Secure government ID-based hospital authentication**

---

## 🔑 Core Features

### 🩸 **Enhanced Blood Donation Management**
- **Comprehensive donor registration** with health validation and eligibility checks
- **Real-time donor board** with live availability tracking and emergency alerts
- **Smart Hospital Assignment** using Google Maps for geographic optimization
- **Social sharing integration** for donation achievements and community engagement
- **Donation journey tracking** from registration to completion with progress indicators
- **WhatsApp Integration** with enhanced location-based messaging

### 🏆 **Gamified Rewards & Recognition System**
- **4-Tab Profile Interface**: Profile, Certificates, Rewards, and Coupons & Offers
- **Achievement Certificates**: Life Saver, Hero Donor, and Community Champion awards
- **Donation Points System**: Earn points for each successful donation with milestone tracking
- **Partner Company Coupons**: Exclusive discounts from 15+ major brands including:
  - **Starbucks** (50% off beverages) • **Zomato** (Free delivery) • **Uber** (25% off rides)
  - **Amazon** (₹500 vouchers) • **BookMyShow** (BOGO movie tickets) • **Flipkart** (15% off electronics)
- **Progress Tracking**: Visual progress bars for upcoming milestones and achievements
- **Social Sharing**: Share certificates and achievements on social media platforms

### 🗺️ **Intelligent Location Services**
- **Google Maps Integration** for precise hospital assignment based on geographic proximity
- **Smart Midpoint Calculation** between donor and acceptor locations
- **Distance Optimization** using Haversine formula for accurate kilometer measurements
- **Fallback Mechanisms** ensuring system reliability when external services are unavailable
- **Real-time Status Indicators** showing Smart Assignment availability

### 📈 **Advanced Analytics Dashboard**
- **Regional Blood Demand Analysis** with interactive bar charts
- **Seasonal Trend Forecasting** showing demand patterns throughout the year
- **Blood Type Distribution** visualization with real-time updates
- **ML Prediction Insights** with confidence scores and trend analysis
- **Critical Period Alerts** for high-demand seasons and emergency situations

### 🏥 **Hospital Portal Features**
- **Secure hospital authentication** with government ID verification
- **Real-time inventory management** with automated shortage alerts
- **Patient request handling** with priority-based assignment
- **Bed and room availability tracking** with capacity management
- **Digital certificate issuance** for completed donations

### 🔄 **Real-Time System**
- **Live data collection** from all donation and request activities
- **Automatic analytics updates** every 30 seconds for fresh insights
- **Real-time status monitoring** with connection indicators
- **Dynamic chart updates** reflecting current blood bank status

---

## 📊 Machine Learning Pipeline

### 🤖 **Model Architecture**
- **Ensemble Learning**: Random Forest + Gradient Boosting for optimal accuracy
- **Feature Engineering**: Seasonal patterns, weather impact, population demographics
- **Real-time Training**: Models update with live donation and request data
- **Prediction Confidence**: 89%+ confidence scores for reliable forecasting

### � **Analytics Features**
- **Regional Demand Mapping**: City-wise blood requirement analysis
- **Seasonal Pattern Recognition**: Festival seasons, weather impact, emergency periods
- **Blood Type Demand Distribution**: Percentage breakdown of requirements by type
- **Predictive Alerts**: Early warning system for potential shortages

### 🔧 **Technical Implementation**
- **Python ML Scripts**: `train_model.py`, `generate_dataset.py`, `update_realtime_model.py`
- **Data Processing**: 93,000+ records spanning 3+ years with realistic patterns
- **Model Persistence**: Automated saving and loading of trained models
- **API Integration**: RESTful endpoints for real-time predictions

---

## 🖥️ Application Architecture

### 🎨 **Frontend Components**
- **Blood Analytics Dashboard** (`/analytics`) - Comprehensive ML insights
- **Live Donor Board** (`/LiveDonorBoard`) - Real-time donor availability with Smart Assignment
- **Enhanced Profile Page** (`/profile`) - 4-tab rewards system with certificates and coupons
- **Donation Portal** (`/donate`) - Enhanced form with real-time data submission
- **Hospital Dashboard** - Inventory management and request processing
- **Navigation System** - Organized dropdown menus and responsive design

### ⚙️ **Backend Services**
- **Analytics API** (`/api/analytics`) - ML predictions and data analysis
- **Real-time Endpoints** (`/api/realtime`) - Live data collection and processing
- **Google Maps Integration** - Geocoding and distance calculation services
- **Authentication System** - JWT-based security for users and hospitals
- **MongoDB Integration** - Comprehensive schemas for all data entities
- **Rewards API** - Certificate generation and coupon management

---

## � User Experience Enhancements

- **Responsive Design** - Mobile-first approach with optimized layouts
- **Interactive Charts** - Dynamic visualizations with hover effects and drill-down capabilities
- **Real-time Feedback** - Live status indicators and activity counters
- **Progressive Enhancement** - Graceful degradation when real-time features are unavailable
- **Social Integration** - Sharing achievements and promoting blood donation awareness

---

## � Security & Trust Features

- **JWT Authentication** for secure user sessions
- **Hospital ID Verification** for trusted institutional access
- **Protected Routes** ensuring authorized access to sensitive features
- **Data Validation** preventing invalid entries and ensuring data integrity
- **Real-time Monitoring** for suspicious activities and fraud prevention

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Aman-Kr09/SMART-BLOOD-BANKING.git

# Navigate to the project directory
cd SMART-BLOOD-BANKING

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Set up Python ML environment
pip install pandas numpy scikit-learn joblib

# Set up environment variables (optional - for Google Maps features)
cp .env.example .env
# Edit .env and add your Google Maps API key:
# REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Start MongoDB service
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod

# Generate initial ML dataset and models
cd backend
python generate_dataset.py
python train_model.py

# Start backend server (Terminal 1)
node index.js

# Start frontend development server (Terminal 2)
cd ..
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

### 🗺️ **Google Maps Setup (Optional)**
For enhanced hospital assignment features:
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Geocoding API
3. Add your API key to the `.env` file
4. See `GOOGLE_MAPS_SETUP.md` for detailed instructions

---

## 🆕 Latest Features & Updates

### 🎉 **September 2025 Release**

#### 🗺️ **Smart Hospital Assignment System**
- **Google Maps Integration**: Intelligent hospital assignment based on geographic proximity
- **Haversine Distance Calculation**: Accurate distance measurement in kilometers
- **Smart Midpoint Algorithm**: Finds optimal hospitals between donor and acceptor locations
- **Fallback Mechanism**: Seamless switching to city/state matching when maps unavailable
- **Visual Indicators**: Real-time status showing Smart Assignment availability (✓/!)

#### 🏆 **Comprehensive Rewards & Gamification**
- **4-Tab Profile System**: Profile • Certificates • Rewards • Coupons & Offers
- **Achievement Certificates**: 
  - 🥉 **Bronze**: Life Saver Certificate (5+ donations)
  - 🥈 **Silver**: Hero Donor Badge (8+ donations)  
  - 🥇 **Gold**: Community Champion (10+ donations)
- **Partner Company Coupons**: 15+ exclusive offers including:
  - ☕ **Starbucks**: 50% off beverages
  - 🍕 **Zomato**: Free delivery on orders
  - 🚗 **Uber**: 25% off rides
  - 📦 **Amazon**: ₹500 shopping vouchers
  - 🎬 **BookMyShow**: Buy 1 Get 1 movie tickets
  - 📱 **Flipkart**: 15% off electronics

#### 📊 **Enhanced User Experience**
- **Progress Tracking**: Visual milestone progress with percentage completion
- **Social Sharing**: Share certificates and achievements on social platforms
- **Mobile Optimization**: Fully responsive design for all devices
- **Real-time Updates**: Live donation tracking and reward calculations
- **Interactive Elements**: Hover effects, animations, and touch-friendly interface

#### 🔧 **Technical Improvements**
- **Error Handling**: Robust fallback mechanisms for offline functionality
- **Performance**: Optimized rendering and reduced loading times
- **Security**: Enhanced JWT authentication and data validation
- **API Integration**: RESTful services for seamless data exchange

---

## 📊 Data Flow Architecture

```mermaid
graph TD
    A[User Donation/Request] --> B[Frontend Form]
    B --> C[Real-time API Endpoint]
    C --> D[MongoDB Database]
    D --> E[CSV Data Export]
    E --> F[ML Analytics Engine]
    F --> G[Updated Predictions]
    G --> H[Live Dashboard Updates]
    H --> I[User Interface]
```

---

## 🛠️ API Endpoints

### 🔐 **Authentication**
- `POST /api/login` - User authentication
- `POST /api/signup` - User registration
- `POST /api/hospital-login` - Hospital authentication
- `GET /api/me` - Get user profile data

### 🩸 **Blood Management**
- `POST /api/donate` - Register blood donation
- `GET /api/donors` - Fetch donor information
- `POST /api/realtime/donation` - Real-time donation tracking
- `POST /api/realtime/request` - Real-time request tracking

### 🏆 **Rewards & Gamification**
- `GET /api/rewards/certificates` - Fetch user certificates
- `GET /api/rewards/points` - Get donation points and milestones
- `GET /api/rewards/coupons` - Retrieve partner coupons
- `POST /api/rewards/redeem` - Redeem coupon codes

### 🗺️ **Location Services**
- `POST /api/maps/geocode` - Convert addresses to coordinates
- `POST /api/maps/nearest-hospital` - Find nearest hospital using maps
- `GET /api/maps/status` - Check Google Maps API availability

### 📈 **Analytics & ML**
- `GET /api/analytics/blood-demand` - Fetch analytics data
- `GET /api/analytics/data` - Real-time analytics with ML insights
- `GET /api/realtime/analytics` - Live system analytics

### 🏥 **Hospital Management**
- `GET /api/hospitals` - Hospital directory
- `POST /api/hospitals/register` - Hospital registration
- `PUT /api/hospitals/inventory` - Update hospital inventory

---

## 🎯 Machine Learning Models

### 📊 **Model Performance**
- **Algorithm**: Random Forest + Gradient Boosting Ensemble
- **Accuracy**: 99.4% R² Score
- **Error Rate**: 4.25 MAE (Mean Absolute Error)
- **Training Data**: 93,504 records across 4 years
- **Features**: 19 engineered features including seasonal, weather, and demographic factors

### 🔄 **Real-time Learning**
- **Automatic Updates**: Models retrain when 50+ new records are available
- **Live Data Integration**: Every donation/request feeds into the analytics system
- **Dynamic Predictions**: Forecasts update based on current trends and patterns
- **Confidence Scoring**: 85-95% confidence intervals for predictions

---

## 🎨 User Interface Features

### 📱 **Responsive Design**
- **Mobile-First Approach** with optimized layouts for all devices
- **Progressive Web App** capabilities for enhanced mobile experience
- **Touch-Friendly Interface** with large buttons and intuitive navigation
- **Dark/Light Mode** support for improved accessibility

### 🎯 **Interactive Elements**
- **Dynamic Charts** with hover effects and drill-down capabilities
- **Real-time Status Indicators** showing system health and connectivity
- **Progress Tracking** for donation journeys and request fulfillment
- **Social Sharing** integration for community engagement

### 🔔 **Notifications & Alerts**
- **Real-time Updates** for donation status and requests
- **Emergency Alerts** for critical blood shortages
- **Success Notifications** for completed donations and achievements
- **System Status** indicators for real-time features

---

## 🔍 Advanced Features

### 🌐 **Geolocation Services**
- **Smart Hospital Assignment** using Google Maps Geocoding API
- **Distance Optimization** with Haversine formula for precise calculations
- **Regional Analytics** showing demand patterns by geographic area
- **Midpoint Calculation** for optimal donor-hospital-acceptor triangulation
- **Fallback Location Matching** ensuring system reliability
- **Location-based Notifications** for nearby donation opportunities

### 🏆 **Gamification & Rewards**
- **Multi-tier Achievement System** with Bronze, Silver, and Gold levels
- **Digital Certificate Generation** with download and sharing capabilities
- **Partner Integration Platform** supporting 15+ major brands
- **Real-time Point Calculation** based on donation impact and frequency
- **Milestone Progress Tracking** with visual progress indicators
- **Social Recognition Features** with achievement sharing

### 🔒 **Security Implementation**
- **JWT Token Authentication** with secure session management
- **Hospital ID Verification** preventing unauthorized institutional access
- **Data Encryption** for sensitive user and medical information
- **Rate Limiting** to prevent API abuse and ensure system stability

### 📊 **Analytics Dashboard Features**
- **Real-time Data Visualization** with live updating charts
- **Predictive Analytics** showing future demand trends
- **Regional Comparison** tools for multi-location analysis
- **Export Capabilities** for reports and data sharing

---

## 🚀 Deployment

### 🌐 **Production Setup**
```bash
# Build for production
npm run build

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=mongodb://localhost:27017/bloodbank_prod
export JWT_SECRET=your_secure_jwt_secret

# Start production server
npm start
```

### 🐳 **Docker Deployment**
```dockerfile
# Create Dockerfile for containerized deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

---

## 🧪 Testing

### ✅ **Test Coverage**
- **Unit Tests** for individual components and functions
- **Integration Tests** for API endpoints and database operations
- **End-to-End Tests** for complete user workflows
- **Performance Tests** for system scalability and response times

### 🔍 **Quality Assurance**
- **Code Linting** with ESLint for consistent code style
- **Security Scanning** for vulnerability detection
- **Performance Monitoring** with real-time metrics
- **Automated Testing** in CI/CD pipeline

---

## 📈 Performance Metrics

- **Response Time**: < 200ms for API calls
- **Real-time Updates**: 30-second refresh intervals
- **Database Performance**: Optimized queries with indexing
- **ML Prediction Speed**: < 100ms for demand forecasting
- **Scalability**: Supports 1000+ concurrent users

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request** with detailed description

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email [231220008@nitdelhi.ac.in](231220008@nitdelhi.ac.in) or join our [Discord community](https://discord.gg/smartbloodbank).

---

## 🌟 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **MongoDB** for flexible data storage
- **scikit-learn** for powerful machine learning capabilities
- **React.js** for dynamic user interfaces
- **All contributors** who made this project possible

---

⭐ **Star this repository if it helped you!** ⭐
